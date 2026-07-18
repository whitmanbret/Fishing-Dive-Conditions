# SpearFactor Dive & Visibility Log

Durable, git-tracked log of in-water reports vs. what the visibility tool predicted.
Lives in this repo on purpose — committing it means it survives even if a chat, the
`~/.claude` folder, or anything else gets wiped. **This replaces logging in a chat.**

## Process (so we can actually grade the tool day-by-day)
The viz tool forecasts *forward* and does **not** store what it predicted on past days.
So to build real accuracy scorecards, capture the tool's number **the same day** you get a report:
1. Open the tool, select the spot, note its viz range (e.g. "14–19 ft") + water temp.
2. Add a row below with: date, spot, **tool predicted**, **actual observed**, match?
3. Commit. That's it.

Match rule (per Bret): if the observed range overlaps the tool's predicted range **at all**, it's a MATCH.

---

## Daily tool predictions (captured same-day — this is the fix)
Snapshot of the tool's predicted viz per spot, captured each day so incoming reports can be graded fairly.

### 2026-07-17
| Spot | Tool viz | Temp |
|---|---|---|
| Treasure Island (Laguna) | 14–19 ft | 71°F |
| Crystal Cove | 14–19 ft | 71°F |
| Crescent Bay | 9–14 ft | 71°F |
| Dana Point / Salt Creek | 10–15 ft | 71°F |
| LJ Shores | 14–19 ft | 71°F |
| LJ Cove | 14–19 ft | 71°F |
| LJ Marine Room | 14–19 ft | 71°F |
| Point Loma | 12–17 ft (green) | 72°F |
| Monterey Bay (Breakwater) | 10–15 ft | 57°F |
| Carmel / Point Lobos | 12–17 ft (green) | 57°F |

---

## Safety / shark notes
- **2026-07-12 — Great white shark attack, Fort Ross Cove (Sonoma coast, NorCal).** Spearfisherman attacked ~10am Sunday 7/12 at a marked spot in Fort Ross Cove. **Diver OK** — minor cuts to head/ear; lost one JBL fin in the attack. Source: NorCal Underwater Hunters (FB), reported ~7/18. Fort Ross is squarely in the "Red Triangle." **Advisory: dive the Fort Ross / Sonoma coast with caution near-term.** → include in this week's report (NorCal safety note).

---

## My dives

### 2026-07-16 — Crescent Bay, Laguna Beach
- **Observed:** viz 10–15 ft · 72°F · WNW wind chop · medium surge · good-size bat rays
- **Tool predicted (spot `crescent`, read live 2026-07-17):** 9–14 ft · 71.4°F · swell 2.2 ft
- **Result:** viz **MATCH** ✅ (9–14 overlaps 10–15) · temp exact (71.4 vs 72°F)
- Caveat: tool value read 7/17 (day after the dive); it doesn't retain the true 7/16 forecast.

### 2026-07-17 — Kelp health note: San Diego–wide warm-water event
- **Observed:** heavy white lacy/frosty coating on giant kelp blades near the surface; kelp looks stressed.
- **Water:** ~72°F, warm spell persisting.
- **Scope:** Bret reports the same situation **happening all over San Diego now**, not spot-specific.
- **Likely cause:** marine-heatwave signature — prolonged 72°F surface water is nutrient-starving the
  canopy (bleaching/decay) while also fueling a *Membranipora membranacea* (lace bryozoan) bloom.
  The white is probably a **mix of both**: decaying/bleaching blades + bryozoan fouling. Heat is the driver.
- **Uncertainty:** can't fully separate bryozoan vs. decay from photos alone — in-water texture check
  is the tell (bryozoan = hard/crusty/gritty, doesn't wipe off; decay = soft/slimy, sloughs off).
- **Why log it:** if this is persisting region-wide it's a canopy-thinning trend worth a dated record
  (echoes past SoCal warm spells: 2014–2016 "Blob," 2018). Watch for recovery when cold upwelling returns.

### 2026-07-17 — Shaw's Cove / the Cove (Laguna) — same-day tool pairing
- **Shaw's Cove:** reported 15–20 ft, murky, very surgy. Tool `laguna` (Shaw's/Diver's) **14–19 ft**, 71.6°F → **MATCH ✅**
- **"The Cove" (inside):** 15–20 ft in spots, a little milky; *"surface makes it look like visibility would be zero"* but 15–20 underneath. Tool **14–19 ft** → **MATCH ✅**
  - Notable: tool called it right **despite a deceptively murky surface** — warm surface lens over cleaner water below. (Which cove exactly TBD — laguna and ljcove both read 14–19 today, so MATCH either way.)

### 2026-07-17 — Crescent Bay — MATCH ✅ (via occasional 15')
- **Reported:** 5–10 ft with **occasional 15'**, murky/milky, **very surgy despite small waves**. Similar yesterday (7/16) morning at Crescent (5–10, murky, surgy).
- **Tool `crescent` (live):** 14–19 ft · 71.6°F · 2 ft swell.
- **Result:** **MATCH** ✅ — the occasional 15' overlaps the tool's 14–19 range (per overlap rule).
- **Context (not a miss, just a note):** typical viz sat at the low end (5–10) while the tool read to the high side of the overlap. Surge-driven murk on small swell is a factor the model doesn't fully weight — Crescent/Laguna coves can turn murky+surgy on calm-looking days. Candidate for a surge-based dampener (analogous to `coveTrap`) if this recurs.

### 2026-07-17 — SD general + Monterey (same-day vs 7/17 tool snapshot)
- **San Diego (general):** 10–15 ft (up to 20 in clearer pockets), green haze/murky, 69–71°F, thermocline ~33–40 ft, swell 2–3 ft NW @15s, S wind ~10 mph. Tool: LJ 14–19 / Pt Loma 12–17 / Kelp 11–16 → **MATCH** (tool sits at the high side of the reported range).
- **Monterey Bay Breakwater:** 5–8 ft ("yucky"). Tool `monterey` (Monterey Bay) 10–15 → **OVER-CALL** ⚠️ (no overlap).
- **Hopkins (Monterey):** 20 ft. Tool 10–15 → tool **under** (Hopkins is a clearer micro-spot).
- **Insight:** Monterey Bay micro-spot variance is huge — Breakwater 5–8 vs Hopkins 20 on the same day. The single tool `monterey` entry (10–15) can't split them; it over-calls Breakwater and under-calls Hopkins. Same limitation as the Laguna coves. ("To say mid is generous" — per reporter.)

### 2026-07-17 — Monterey micro-spots + snorkel group (addendum)
- **Monterey (contour → aquarium pipes / Cannery Row / Breakwater):** marginal, ~10 ft max along the 40–50 ft contour, 52°F avg. Tool `monterey` 10–15 → **MATCH** (edge, at 10).
- **Hopkins:** 20–25 ft (large sheepshead at Metridium Mountain). Tool 10–15 → tool **UNDER** (Hopkins clearer micro-spot — 2nd day running).
- **LJ Marine Room (Women's Snorkel Group):** warm water, "miso soup" 10–12 ft, heavy particulate. Tool `ljmarineroom` 14–19 → **OVER-CALL** ⚠️ (no overlap; tool ~2–7 ft high). Notable: Marine Room already has the `coveTrap` sediment dampener yet still over-called on a warm, high-particulate day — the warm-surface particulate murk is under-weighted (same theme as Crescent surge-murk).
- **Monterey Bay (general):** 18–22 ft. Tool `monterey` 10–15 → **UNDER-call** ⚠️ (no overlap; tool ~3–7 ft low).
- **Repeated signal:** on 7/17 Monterey Bay spanned ~5–10 ft (Breakwater "yucky"/marginal) to 18–25 ft (Hopkins + general Monterey Bay 18–22). The single tool entry (10–15) matched the marginal side but under-called the clear side — a 5-to-22-ft spread one entry can't cover. Hopkins/clear-bay warrant their own spot or a clarity uplift.

### 2026-07-18 — La Jolla Shores — Scripps cam vs tool — UNDER-call ⚠️
- **Ground truth (Scripps PIERViz underwater cam @ ~13 ft, Scripps Pier / LJ Shores):** ~10–12 ft, green water.
- **Tool `ljshores` (live):** 2–4 ft "pea soup," 72°F, swell 2.4 ft @9s.
- **Result:** **UNDER-call** ⚠️ (no overlap; tool ~6–10 ft too low). Water is green but far from pea soup.
- **Likely cause:** today's chlorophyll/bloom signal is over-penalizing viz region-wide — same spike that put Monterey at 3–5 and Hopkins at 8–10 today. The chl-viz penalty looks too aggressive when the actual bloom is moderate. Candidate fix: cap/sanity-check the chl-viz penalty (or verify the satellite chl value isn't an anomalous spike).

---

## Just Get Wet reports — San Diego (pulled from justgetwet.com/blogs/dive-reports-and-conditions, 2026-07-17)
Their reports are region-general ("San Diego" / "La Jolla"), not spot-specific.

| Date | JGW reported viz | Temp | Swell |
|---|---|---|---|
| 2026-07-16 | 8–15 ft (15–20 protected) | 69–70°F | — |
| 2026-07-15 | 10–20 ft | 68–70°F | 2–3 ft |
| 2026-07-13 (La Jolla) | 8–10 ft (up to 15 clean) | 68–70°F | 2–3 ft SSW @14s |
| 2026-07-12 | 10–15 ft | 68–70°F | 2–3 ft |
| 2026-07-11 | 10–15 ft | 68–70°F | 2–4 ft |
| 2026-07-10 | 10–15 ft | 69–70°F | 1.5–2 ft |

**Tool readings captured 2026-07-17 (SD spots — a single snapshot, NOT per-day history):**
LJ Shores 14–19 · LJ Cove 14–19 · LJ Marine Room 14–19 · LJ Kelp Beds 11–16 · Point Loma 12–17 (green tinge) · water temp ~71°F.

> These can only be fairly compared to the 7/16–7/17 window. Earlier JGW days lack a matching
> tool prediction because none was captured at the time — going forward, capture daily (see Process).

---

## Tool calibration notes salvaged from the tool's config (this week)
These are dated observations already embedded in `index-source.html` LOCATIONS comments:
- **2026-07-11** — Woods Cove (Laguna): all-whitewater at 3–5 ft sets (blown out).
- **2026-07-13** — Divers Cove (Laguna): 5–10 ft.
- **2026-07-14** — Treasure Island (Laguna): 15–20 ft ≈ tool `laguna` 14–19 (match). Added TI + Woods Cove as spots.

---

## Full week reports (Bret's dive group, 2026-07-11 → 07-16)

**IMPORTANT — the "Tool" column is a single live snapshot read on 2026-07-17, NOT each day's
actual forecast.** The tool doesn't retain past-day predictions. So these are only a fair grade
for 7/16 reports (day before the snapshot); 7/11–7/15 rows are marked *(stale)* and cannot be
scored reliably — conditions genuinely changed across the week. Match rule = ranges overlap at all.

| Date | Spot | Reported viz | Temp | Tool (7/17 snapshot) | Overlap? |
|---|---|---|---|---|---|
| 7/11 Sat | Dana Point (¼ mi, headlands) | 5–8 ft, patchy green | — | 10–15 | ✗ *(stale +5d)* |
| 7/12 Sun | Point Lobos (cove→worm patch→depth) | <10 cove / 20 patch / 25–30 deep | 57/50F | 12–17 (green) | partial *(stale)* |
| 7/13 Mon | LJ Marine Room ~2:30p | 10–15 (muck in shallows) | — | 14–19 | ✓ edge *(stale)* |
| 7/14 Tue | Crystal Cove (South Coast Divers) | 15–20 | — | 14–19 | ✓ *(stale)* |
| 7/14 Tue | Monterey Breakwater (2 dives) | Wall 20–30++, middle reef ~15 | cold | 10–15 | ✓ at reef / ✗ wall *(stale)* |
| 7/15 Wed | Crystal Cove 6am | 5–10 (early AM) | — | 14–19 | ✗ |
| 7/15 Wed | Point Loma 5pm | 8–12 (some 15), rotten kelp/snot | — | 12–17 (green) | ✓ edge |
| 7/15 Wed | LJ Shores (after work) | shallow ~10–15, deep 30+ @85'+ | 54F@111', mostly >63F | 14–19 | ✓ edge (shallow) |
| 7/15 Wed | Monterey Breakwater | 10–15 (pea soup + frost gatorade) | — | 10–15 | ✓ exact |
| 7/15 Wed 6pm | (location not stated) | 20–30 "best I've seen all year" | — | — | n/a |
| 7/16 Thu | Goff / Treasure Island 9am | 6' shallow, 10–12 deep, some 15; super warm | warm | 14–19 | ✓ edge |
| 7/16 Thu | Treasure Island 2pm | 10–12 (some swell) | — | 14–19 | ✗ (tool high) |
| 7/16 Thu | La Jolla Cove ~2pm | ~15 (hazy toward buoy) | — | 14–19 | ✓ |
| 7/16 Thu | Crescent Bay (Bret) | 10–15 | 72F | 9–14 | ✓ |

**Wildlife/notes worth keeping:** 7/16 Goff — many leopard sharks (10" to 3.5'), massive sheepshead
& calicos, bat ray, first-ever wild sea cucumbers (×2). 7/16 LJ Cove — bright garibaldis, sea-lion
interaction, brown floating "stuff" outside the cove. 7/14 Breakwater — Thornback Ray. 7/12 Pt Lobos —
largest white Odhner's dorid nudibranch the reporter had seen.

### Honest read on this week
- **Where the tool is fair to grade (7/16, day before snapshot):** matched LJ Cove (~15) and
  Goff-deeper/Crescent, but **over-called Treasure Island 2pm** (reported 10–12 vs tool 14–19).
- **Pattern:** the tool's SoCal snapshot runs to the **high side (14–19)** and misses low-viz
  situations — early-AM (Crystal 6am 5–10), swell-affected afternoons (Treasure 2pm), and
  near-shore/headland green water (Dana Point 5–8).
- **Genuinely can't grade 7/11–7/15** without each day's captured tool number. From now on we
  capture it same-day (see Process at top) so next week is a real scorecard.
