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

**Scope note — frame capture is NOT included.** Grabbing a live still off the
Scripps stream needs ffmpeg + HDOnTap's signed HLS (no public snapshot endpoint),
which is a separate service to build. Feed this script a screenshot or saved
frame for now; an automated grabber can be wired to it later.
