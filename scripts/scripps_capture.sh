#!/usr/bin/env bash
# scripps_capture.sh — grab ONE live frame from the Scripps PIERViz underwater
# cam, estimate visibility, optionally post it, and append a paired
# (sensor-features -> cam-viz) row to a training CSV.
#
# WHY: the Scripps cam is direct ground truth for La Jolla clarity; pairing each
# frame's cam-derived viz with the concurrent Scripps NTU/chl builds the dataset
# that will eventually calibrate/replace the hand-tuned NTU->viz curve. See
# scripts/README.md and the dive log.
#
# HOST-AGNOSTIC: runs on macOS (dev) and Linux / GitHub Actions (prod).
#   deps: bash, curl, python3, ffmpeg  (system ffmpeg, or $FFMPEG_BIN, or the
#         imageio-ffmpeg pip package resolved via $PYTHON)
#   env:  ANTHROPIC_API_KEY  — needed for the estimate / --post step
#
# HOW THE STREAM AUTH WORKS (recon 2026-07-30): the cam has no public snapshot,
# but portal.hdontap.com/backend/embed/<stream>?r=<base64(referrer)> returns a
# base64 JSON whose .streamSrc is a signed HLS URL (~12 h token). The only gate
# is a valid Referer (the coollab embedding page). We mint, then ffmpeg pulls
# one frame.
#
# USAGE:
#   ./scripps_capture.sh                # capture + estimate + log a row
#   ./scripps_capture.sh --post         # + post display-only to the feed
#   ./scripps_capture.sh --no-estimate  # just grab a frame + log NTU/chl
set -euo pipefail

# ---- config ----------------------------------------------------------------
STREAM="scripps_pier-underwater-CUST"
REFERER="https://coollab.ucsd.edu/pierviz/"
EMBED_API="https://portal.hdontap.com/backend/embed/${STREAM}"
ERDDAP="https://erddap.caloos.org/erddap/tabledap/scripps-pier-automated-shore-sta-1.json"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAME_DIR="${FRAME_DIR:-$SCRIPT_DIR/frames}"
CSV="${CSV:-$SCRIPT_DIR/cam_training_log.csv}"
PYTHON="${PYTHON:-python3}"

# Daylight gate (America/Los_Angeles) — the cam goes IR/black at night and is
# not usable for a viz estimate. [START_HOUR, END_HOUR).
START_HOUR="${START_HOUR:-6}"
END_HOUR="${END_HOUR:-20}"

# ---- args ------------------------------------------------------------------
POST=0; ESTIMATE=1
for a in "$@"; do
  case "$a" in
    --post) POST=1 ;;
    --no-estimate) ESTIMATE=0 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown arg: $a" >&2; exit 2 ;;
  esac
done

log() { echo "[$(date -u +%FT%TZ)] $*"; }

# ---- daylight gate ---------------------------------------------------------
HOUR=$(TZ=America/Los_Angeles date +%H)
if [ "$((10#$HOUR))" -lt "$START_HOUR" ] || [ "$((10#$HOUR))" -ge "$END_HOUR" ]; then
  log "skip: outside daylight window ${START_HOUR}-${END_HOUR} PT (PT hour=$HOUR)"
  exit 0
fi

# ---- resolve ffmpeg --------------------------------------------------------
if [ -n "${FFMPEG_BIN:-}" ]; then
  FF="$FFMPEG_BIN"
elif command -v ffmpeg >/dev/null 2>&1; then
  FF="ffmpeg"
else
  FF="$("$PYTHON" -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())' 2>/dev/null || true)"
fi
[ -n "${FF:-}" ] || { echo "error: no ffmpeg (set FFMPEG_BIN, install ffmpeg, or 'pip install imageio-ffmpeg')" >&2; exit 1; }

mkdir -p "$FRAME_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
FRAME="$FRAME_DIR/scripps_${TS}.jpg"

# ---- mint signed HLS URL ---------------------------------------------------
R=$(printf '%s' "$REFERER" | base64)
SRC=$(curl -fsS -A "$UA" -e "$REFERER" "${EMBED_API}?r=${R}" \
        | base64 -d \
        | "$PYTHON" -c 'import sys,json;print(json.load(sys.stdin).get("streamSrc",""))')
[ -n "$SRC" ] || { echo "error: failed to mint stream URL (referrer gate / API change?)" >&2; exit 1; }

# ---- grab one frame --------------------------------------------------------
HDR=$(printf 'Referer: %s\r\n' "$REFERER")
"$FF" -y -loglevel error -headers "$HDR" -i "$SRC" -frames:v 1 -q:v 2 "$FRAME"
[ -s "$FRAME" ] || { echo "error: frame grab failed" >&2; exit 1; }
log "frame: $FRAME ($(wc -c <"$FRAME" | tr -d ' ') bytes)"

# ---- concurrent Scripps sensor features (NTU + chl) ------------------------
NTU=""; CHL=""; NTU_TIME=""
FEAT=$(curl -fsS --max-time 25 \
  "${ERDDAP}?time,sea_water_turbidity_eco,mass_concentration_of_chlorophyll_in_sea_water_eco&orderByMax(%22time%22)" \
  2>/dev/null | "$PYTHON" -c '
import sys,json
def _num(x):
    return repr(x) if isinstance(x,(int,float)) and not isinstance(x,bool) else ""
try:
    t=json.load(sys.stdin)["table"]
    d=dict(zip(t["columnNames"], t["rows"][0]))   # map by NAME, not position
    ntu=_num(d.get("sea_water_turbidity_eco"))
    chl=_num(d.get("mass_concentration_of_chlorophyll_in_sea_water_eco"))
    tm=d.get("time"); tm=tm if isinstance(tm,str) else ""
    print(f"{ntu}\t{chl}\t{tm}")
except Exception:
    print("\t\t")' || printf '\t\t')
IFS=$'\t' read -r NTU CHL NTU_TIME <<<"$FEAT"
log "sensor: NTU=${NTU:-NA} chl=${CHL:-NA} @ ${NTU_TIME:-NA}"

# ---- estimate --------------------------------------------------------------
VLO=""; VHI=""; CONF=""; PILING=""; USABLE=""
if [ "$ESTIMATE" = "1" ] && [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  EARGS=(--json); [ "$POST" = "1" ] && EARGS+=(--post)
  # CAM_MODEL lets automation use a cheaper model than the script's Opus default
  # (the vision estimate is the ONLY paid step — frame + NTU/chl capture is free).
  [ -n "${CAM_MODEL:-}" ] && EARGS+=(--model "$CAM_MODEL")
  _err=$(mktemp)
  if OUT=$("$PYTHON" "$SCRIPT_DIR/scripps_cam_viz.py" "$FRAME" "${EARGS[@]}" 2>"$_err"); then
    IFS=$'\t' read -r VLO VHI CONF PILING USABLE <<<"$(printf '%s' "$OUT" | "$PYTHON" -c '
import sys,json
d=json.load(sys.stdin)
print("\t".join(str(d.get(k,"")) for k in
      ("viz_low_ft","viz_high_ft","confidence","furthest_piling_ft","usable_frame")))')"
    log "estimate: ${VLO}-${VHI} ft ($CONF, furthest piling ~${PILING} ft, usable=$USABLE)"
  else
    log "estimate: scripps_cam_viz.py failed — $(tr '\n' ' ' < "$_err" | tail -c 500)"
  fi
  rm -f "$_err"
elif [ "$ESTIMATE" = "1" ]; then
  log "estimate: skipped — ANTHROPIC_API_KEY not set"
fi

# ---- append training row ---------------------------------------------------
if [ ! -f "$CSV" ]; then
  echo "capture_time_utc,frame_file,ntu,chl,sensor_time_utc,cam_viz_low_ft,cam_viz_high_ft,confidence,furthest_piling_ft,usable_frame" > "$CSV"
fi
printf '%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n' \
  "$TS" "$(basename "$FRAME")" "$NTU" "$CHL" "$NTU_TIME" \
  "$VLO" "$VHI" "$CONF" "$PILING" "$USABLE" >> "$CSV"
log "logged -> $CSV"
