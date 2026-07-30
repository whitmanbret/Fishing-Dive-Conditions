# scripts/

Standalone tools for the SpearFactor conditions project. **Not part of the deployed
static site** — these run locally / server-side, never in the browser.

## scripps_cam_viz.py — cam-frame → visibility estimator (prototype)

Estimates La Jolla Shores underwater visibility from a single Scripps PIERViz
underwater-camera frame, by how far down the row of pier pilings is still
resolvable (pilings sit at ~4, 11, 14, 30 ft). Uses the Claude vision API.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
pip install anthropic pydantic

python scripts/scripps_cam_viz.py path/to/frame.jpg          # estimate
python scripts/scripps_cam_viz.py https://.../frame.jpg      # from a URL
python scripts/scripps_cam_viz.py frame.jpg --post           # + post to feed
python scripts/scripps_cam_viz.py frame.jpg --json           # machine-readable
```

Output: visibility range (ft), confidence, furthest resolvable piling, and a
one-line rationale. `--post` sends it to the Recent Reports feed as a cam-sourced
`ljshores` reading (display-only — `predictedViz` is left empty so it never feeds
the viz calibration; night/IR/low-confidence frames are skipped).

The piling calibration in the prompt was refined 2026-07-30 with an operator-
annotated reference frame that pins each piling's IN-FRAME position (near-right
= 4 ft, right = 11 ft, left/pump = 14 ft, back-center = 30 ft).

## scripps_capture.sh — automated frame grabber + training-row logger

Grabs ONE live frame off the Scripps PIERViz underwater cam, runs it through
`scripps_cam_viz.py`, optionally posts it, and appends a paired
`(Scripps NTU + chl) -> cam-viz` row to a training CSV. This is the data-
collection front end for the eventual sensor→viz calibration model.

```bash
export ANTHROPIC_API_KEY=sk-ant-...      # for the estimate / --post step
./scripts/scripps_capture.sh             # capture + estimate + log a row
./scripts/scripps_capture.sh --post      # + post display-only to the feed
./scripts/scripps_capture.sh --no-estimate  # just grab a frame + log NTU/chl
```

**How the stream auth works (recon 2026-07-30).** The cam has no public snapshot,
but the HDOnTap embed mints a signed HLS URL from a referrer-gated API — the only
gate is a valid `Referer` (the coollab embedding page):

1. `GET portal.hdontap.com/backend/embed/scripps_pier-underwater-CUST?r=<base64(referrer)>`
   with `Referer: https://coollab.ucsd.edu/pierviz/` → base64 JSON → `.streamSrc`
   is a signed `live.hdontap.com/hls/.../playlist.m3u8?t=…&e=…` (~12 h token).
2. `ffmpeg -headers "Referer: …" -i "<streamSrc>" -frames:v 1 -q:v 2 frame.jpg`.

**ffmpeg** is resolved from `$FFMPEG_BIN`, then the system `ffmpeg`, then the
`imageio-ffmpeg` pip package via `$PYTHON` (self-contained, no brew needed).

**Outputs** (both git-ignored — see `.gitignore`; durable storage is a pending
decision):
- `scripts/frames/scripps_<UTC>.jpg` — the captured frame (the model's label source).
- `scripts/cam_training_log.csv` — one row per capture:
  `capture_time_utc, frame_file, ntu, chl, sensor_time_utc, cam_viz_low_ft,
   cam_viz_high_ft, confidence, furthest_piling_ft, usable_frame`.

**Daylight-gated** (America/Los_Angeles `START_HOUR`–`END_HOUR`, default 6–20) —
the cam goes IR/black at night; the estimator also flags unusable frames.

**Prod host:** designed to run on GitHub Actions on a daylight cron (runners have
ffmpeg preinstalled). Two things to settle before wiring the cron: keep the CSV
off `main` (a data branch) so it doesn't trigger Cloudflare Pages rebuilds, and
decide how often to `--post` (data capture is frequent; the public feed should
NOT get 12–20 cam posts/day).
