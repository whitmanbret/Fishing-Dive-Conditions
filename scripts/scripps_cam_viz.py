#!/usr/bin/env python3
"""
Scripps Pier underwater-cam → visibility estimator (prototype).

Reads ONE still frame from the Scripps PIERViz underwater camera (a local file
path OR an image URL) and estimates in-water visibility by how far down the row
of pier pilings is still resolvable, using the camera's known piling distances.
Optionally POSTs the result to the SpearFactor worker as a cam-sourced reading
for La Jolla Shores.

WHY THIS EXISTS
  The Scripps automated shore station (turbidity + chlorophyll) has been offline
  since 2026-07-15, so the viz tool falls back to stale daily satellite chl for
  La Jolla and can't see intraday clearing (7/25: tool 5-8 ft vs cam 20-25 ft).
  The underwater cam IS a real-time clarity signal — this script turns a cam
  frame into a numeric viz reading, exactly the way you'd eyeball it: which is
  the furthest piling you can still make out?

  Frame CAPTURE (grabbing a live still off the HDOnTap stream) is a separate
  problem — HDOnTap serves a signed HLS stream with no public snapshot endpoint,
  so it needs ffmpeg + stream auth and is intentionally out of scope here. Feed
  this script a screenshot or a saved frame; wire up an automated grabber later.

USAGE
  export ANTHROPIC_API_KEY=sk-ant-...
  pip install anthropic

  # Estimate from a local screenshot:
  python scripts/scripps_cam_viz.py ~/Downloads/scripps_cam.jpg

  # From an image URL:
  python scripts/scripps_cam_viz.py https://example.com/frame.jpg

  # Estimate AND post to the Recent Reports feed (no names, cam-sourced):
  python scripts/scripps_cam_viz.py frame.jpg --post

  # Machine-readable:
  python scripts/scripps_cam_viz.py frame.jpg --json
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.request
from typing import Literal

try:
    import anthropic
    from pydantic import BaseModel, Field
except ImportError:
    sys.exit(
        "Missing deps. Install with:\n  pip install anthropic pydantic"
    )

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
MODEL = "claude-opus-4-7"
REPORT_URL = "https://spearfactor-api.whitmanbret.workers.dev/report"
SPOT_ID = "ljshores"
SPOT_NAME = "La Jolla Shores"

# Stable calibration prompt (no timestamps/IDs — safe to prompt-cache).
# NOTE: this prefix is well under the ~4096-token cache minimum for Opus, so the
# cache_control marker below is a no-op today (cache_creation stays 0). It's kept
# so caching kicks in automatically if the calibration grows, and costs nothing.
CALIBRATION_SYSTEM = """\
You are an oceanographic visibility analyst reading a single still frame from the \
Scripps Pier PIERViz UNDERWATER camera at La Jolla Shores, California. Your only \
job is to estimate horizontal in-water visibility, in feet, from how far down the \
row of pier pilings remains resolvable.

CAMERA / PILING CALIBRATION (fixed geometry — positions verified against an
operator-annotated reference frame, 2026-07-30):
- The camera looks down the underside of Scripps Pier along a row of concrete
  pilings. Identify each piling by its POSITION in the frame:
  * ~4 ft  — the NEAREST piling on the RIGHT edge: large, heavily fouled /
             encrusted with marine growth. Essentially always visible.
  * ~11 ft — the next piling on the RIGHT, set back just behind the 4 ft one.
  * ~14 ft — the piling on the LEFT that has a pump / instrument line hanging
             down from it.
  * ~30 ft — the FARTHEST piling, standing toward the BACK / CENTER of the
             frame. Resolvable only in genuinely clear water.
- The furthest piling you can still clearly RESOLVE (distinct edges/structure,
  not just a vague shadow) ≈ the current horizontal visibility:
  * Only the near 4 ft right piling resolvable, water hazy/green    → ~4-8 ft
  * Out to the 11 ft right piling                                   → ~10-14 ft
  * Out to the 14 ft left/pump piling (needs calm, clear water)     → ~14-20 ft
  * The 30 ft back-center piling + structure beyond it, blue water  → ~20-30+ ft
- Interpolate between these anchors; report a RANGE that brackets the true value.

READING RULES:
- Water COLOR is a strong cue: murky brown/green = low viz; light blue with rays
  of light and distant structure = high viz.
- Daylight only. If the frame looks like night / IR / near-black or is dominated
  by artificial light, do not guess a number — return low confidence and say the
  frame is not usable.
- Account for TIDE: at low tide the camera sits shallower and fewer distant
  pilings may be in frame; don't read "few pilings visible" as low viz if the
  distant pilings are simply out of frame or above the waterline.
- Account for near-field SURGE / suspended sediment: a swirling, particulate-laden
  near field with otherwise-clear water beyond can read cloudier than it is —
  weight the FURTHEST resolvable structure over near-field haze.
- Camera fouling, condensation, or a dirty dome can mimic low viz — if the whole
  frame is uniformly blurred (not depth-graded), lower your confidence.

CONFIDENCE:
- high    = clear daylight frame, pilings give an unambiguous furthest-resolvable point
- moderate= readable but with some ambiguity (glare, mild fouling, borderline piling)
- low     = night/IR/unusable frame, heavy fouling, or you cannot identify pilings

Report the furthest piling distance you could resolve (4, 11, 14, or 30 ft; use 0
if you cannot resolve even the near piling), the visibility range in feet, a
confidence level, and a single-sentence rationale.\
"""

USER_INSTRUCTION = (
    "Estimate the current underwater visibility at La Jolla Shores from this "
    "Scripps Pier underwater camera frame, using the piling calibration."
)


class VizEstimate(BaseModel):
    """Structured visibility estimate returned by the model."""
    furthest_piling_ft: int = Field(
        description="Distance of the furthest clearly resolvable piling (0, 4, 11, 14, or 30)."
    )
    viz_low_ft: int = Field(description="Low end of the estimated visibility range, in feet.")
    viz_high_ft: int = Field(description="High end of the estimated visibility range, in feet.")
    confidence: Literal["high", "moderate", "low"]
    usable_frame: bool = Field(
        description="False if the frame is night/IR/unusable and no numeric estimate is reliable."
    )
    rationale: str = Field(description="One sentence explaining the estimate.")


# ---------------------------------------------------------------------------
# Image loading
# ---------------------------------------------------------------------------
_MEDIA_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".gif": "image/gif", ".webp": "image/webp",
}


def build_image_block(image: str) -> dict:
    """Return an Anthropic image content block for a URL or a local file path."""
    if image.startswith(("http://", "https://")):
        return {"type": "image", "source": {"type": "url", "url": image}}
    if not os.path.isfile(image):
        sys.exit(f"error: image not found: {image}")
    ext = os.path.splitext(image)[1].lower()
    media_type = _MEDIA_TYPES.get(ext)
    if not media_type:
        sys.exit(f"error: unsupported image type '{ext}'. Use jpg/png/gif/webp.")
    with open(image, "rb") as f:
        data = base64.standard_b64encode(f.read()).decode("utf-8")
    return {
        "type": "image",
        "source": {"type": "base64", "media_type": media_type, "data": data},
    }


# ---------------------------------------------------------------------------
# Estimation
# ---------------------------------------------------------------------------
def estimate(image: str, model: str) -> tuple[VizEstimate, "anthropic.types.Usage"]:
    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
    kwargs = dict(
        model=model,
        max_tokens=3000,
        system=[
            {
                "type": "text",
                "text": CALIBRATION_SYSTEM,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": [build_image_block(image), {"type": "text", "text": USER_INSTRUCTION}],
            }
        ],
        output_format=VizEstimate,
    )
    # Adaptive thinking helps larger models reason about piling geometry / water
    # color, but Haiku doesn't support it ("adaptive thinking is not supported on
    # this model"). Only request it for models that do (Opus/Sonnet); the cheap
    # Haiku automation path reasons directly into the structured output instead.
    if "haiku" not in model.lower():
        kwargs["thinking"] = {"type": "adaptive"}
    response = client.messages.parse(**kwargs)
    if response.parsed_output is None:
        sys.exit("error: model did not return a parseable estimate (possible refusal).")
    return response.parsed_output, response.usage


# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------
def post_report(est: VizEstimate) -> dict:
    """POST the estimate to the worker feed as a cam-sourced ljshores reading.

    predictedViz is left empty on purpose: cam readings are display-only and must
    NOT feed applyVizCalibration (which would double-correct spots we've already
    tuned). See project_dive_log.md for the calibration-safety rule.
    """
    viz_mid = round((est.viz_low_ft + est.viz_high_ft) / 2)
    notes = (
        f"Scripps underwater cam auto-estimate (vision): furthest resolvable piling "
        f"~{est.furthest_piling_ft} ft -> viz {est.viz_low_ft}-{est.viz_high_ft} ft, "
        f"{est.confidence} confidence. {est.rationale}"
    )
    payload = {
        "spotId": SPOT_ID,
        "spotName": SPOT_NAME,
        "viz": viz_mid,
        "waterTemp": None,
        "notes": notes,
        "predictedViz": "",
        "predictedRange": "",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        REPORT_URL, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.load(resp)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser(description="Estimate viz from a Scripps underwater cam frame.")
    ap.add_argument("image", help="Local image path OR image URL of a cam frame.")
    ap.add_argument("--post", action="store_true", help="POST the result to the ljshores feed.")
    ap.add_argument("--model", default=MODEL, help=f"Model (default: {MODEL}).")
    ap.add_argument("--json", action="store_true", dest="as_json", help="Print JSON only.")
    args = ap.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("error: set ANTHROPIC_API_KEY in your environment.")

    est, usage = estimate(args.image, args.model)
    result = est.model_dump()

    if args.post:
        if not est.usable_frame or est.confidence == "low":
            result["posted"] = False
            result["post_skipped"] = "unusable frame / low confidence — not posted"
        else:
            try:
                result["post_response"] = post_report(est)
                result["posted"] = True
            except Exception as e:  # noqa: BLE001 - surface any post failure
                result["posted"] = False
                result["post_error"] = str(e)

    if args.as_json:
        print(json.dumps(result, indent=2))
        return

    flag = "" if est.usable_frame else "  [FRAME NOT USABLE]"
    print(f"Visibility: {est.viz_low_ft}-{est.viz_high_ft} ft  ({est.confidence} confidence){flag}")
    print(f"Furthest resolvable piling: ~{est.furthest_piling_ft} ft")
    print(f"Rationale: {est.rationale}")
    if usage is not None:
        print(
            f"[tokens in={usage.input_tokens} cache_read={getattr(usage, 'cache_read_input_tokens', 0)} "
            f"out={usage.output_tokens}]",
            file=sys.stderr,
        )
    if args.post:
        if result.get("posted"):
            print(f"Posted to feed: {result['post_response']}")
        else:
            print(f"Not posted: {result.get('post_skipped') or result.get('post_error')}")


if __name__ == "__main__":
    main()
