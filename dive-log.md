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

### 2026-07-20 (captured live from the tool, same-day)
| Spot | Tool viz | Temp |
|---|---|---|
| Flat Rock / Palos Verdes (`pv`) | 18–23 ft | 74°F (surface) |
| La Jolla Shores (`ljshores`) | 11–16 ft (green tinge) | — |
| Point Loma (`pointloma`) | 9–14 ft (green tinge) | — |
| La Jolla Cove (`ljcove`) | 11–16 ft (green tinge) | 74°F (surface) |

### 2026-07-21 (captured live from the tool, same-day)
| Spot | Tool viz | Temp |
|---|---|---|
| La Jolla Shores (`ljshores`) | 11–16 ft (green tinge) | 74°F (surface) |
| La Jolla Marine Room (`ljmarineroom`) | 7–9 ft (post-haircut; worker raw 11–15) | 74°F |
| La Jolla Cove (`ljcove`) | 7–9 ft | 74°F |
| Carmel Bay (`carmel`) | 14–19 ft (est.) | 55°F |
| Lovers Point (`loverspoint`) | 15–20 ft (green water) | 61°F |
| Hopkins (`hopkins`) | 26–31 ft (bloom season) | 61°F |

---

## Safety / shark notes
- **2026-07-12 — Great white shark attack, Fort Ross Cove (Sonoma coast, NorCal).** Spearfisherman attacked ~10am Sunday 7/12 at a marked spot in Fort Ross Cove. **Diver OK** — minor cuts to head/ear; lost one JBL fin in the attack. Source: NorCal Underwater Hunters (FB), reported ~7/18. Fort Ross is squarely in the "Red Triangle." **Advisory: dive the Fort Ross / Sonoma coast with caution near-term.** → include in this week's report (NorCal safety note).

---

## Data source status
- **Scripps Pier shore station (turbidity + chlorophyll) — offline since 2026-07-15.** Three SoCal AUTOSS stations (Scripps / Santa Monica / Stearns Wharf) stopped simultaneously ~03:00 UTC 7/15, pointing to a recoverable pipeline issue rather than a dead sensor. During the outage `ljshores` falls back to daily satellite chl and can't see intraday clearing → the recurring afternoon UNDER-calls (7/25, 7/28, 7/29). Outage caveat + Scripps cam are the interim ground truth.
  - **2026-07-29 — reported to SCCOOS; they replied they're looking into it and believe our diagnosis is correct.** Awaiting sensor restoration; no code change needed on our side — the fallback + caveat are behaving as designed.

---

## My dives

### 2026-07-30 — La Jolla Shores (Scripps cam, afternoon) — SENSOR BACK ✅ / but UNDER-call ⚠️ (new cause: wave-energy penalty)
- **Reported:** Scripps underwater cam showing **~30 ft, very blue, very clear** (frame confirms: near fouled piling + receding pilings + sandy bottom all resolvable through clean blue water, easily 25–30 ft).
- **BIG NEWS — the Scripps shore station is back online.** Tool now reads **live** Scripps Pier turbidity **0.32 NTU** + chl **0.29**, `vizConfidence: High` ("Live turbidity + live chlorophyll"), `shorePrimaryDown: false`, outage caveat correctly gone. SCCOOS's fix landed (they'd said 7/29 they were looking into it and agreed with our diagnosis).
- **Tool `ljshores` (live):** **7–11 ft** (hero) → **UNDER-call ⚠️** vs a ~30 ft cam.
- **New root cause (NOT stale data this time):** replayed the exact worker viz call — inputs `ntu 0.32, chl 0.29, waveEnergy 87.5, swellPeriod 14`. Worker takes the `ntu` path (correctly clear water) but a **wave-energy penalty** (WE 87.5 → effectiveWE 52.75) crushes it to **9–14 ft**. The long-period (14s) south swell is triggering a surf-stir haircut even though the **live turbidity already measures the water as crystal clear**.
- **Diagnosis:** with a live low-NTU reading, the wave-energy penalty is **double-counting** — the turbidity sensor already captures the swell's real effect on clarity. The WE proxy makes sense when NTU is unavailable; it should back off when NTU is live and low. **Worker-side fix** (worker source not in this repo). Flagged to Bret 7/30.
- Posted display-only (`predictedViz:""`) — sensor-transition/model-issue miss, not a calibration-tuning signal.

### 2026-07-29 — La Jolla (all day) — morning MATCH ✅ / afternoon clearing UNDER-call ⚠️ / Cove pea soup MATCH ✅
- **Morning:** Scripps cam ~**10–14 ft**; tool `ljshores` **8–13 ft** → **MATCH ✅** ("visibility prediction tool was spot on this morning" — Bret).
- **Vallecitos sandy shallows:** now **very clear** — the pocket that was 0–10 ft last week has cleared; bat rays, diamond rays, a few leopard sharks, clear out to the sand dollars; silts up further south.
- **Afternoon (~6pm, slight incoming tide):** water off the launch and the Beach & Tennis Club was **crystal clear, 15–20 ft**, and the cam pushed to **~25–30 ft**. A turtle cruising toward turtle town. Tool held **8–13** → **UNDER-call ⚠️** — the recurring sensor-down clearing miss (Scripps NTU offline; outage caveat flags it). Bret: the afternoon cleared on the incoming tide, **same as yesterday** — a tidal/diurnal clearing signal worth noting.
- **Caves / turtle town / Cove:** **absolute pea soup.** Tool `ljcove` (low, ~5–8) → **MATCH ✅** — the 0.6× cove haircut holds the Cove low while the Shores clears. Sharpest split yet: crystal-clear Shores and pea-soup caves in the same outing.

### 2026-07-29 — Mission Point Park (MPP) — MATCH ✅ (same-day)
- **Reported:** warm and murky at the entry (bay side); **~15 ft after wrapping the corner** (channel side), and noticeably colder there.
- **Tool `mission` (live, same-day):** **14–19 ft**, 76°F, 3–4 ft surf.
- **Result:** **MATCH** ✅ (14–19 overlaps the ~15 ft channel read). Warm murky bay-side entry vs colder/clearer channel is the classic Mission split; the tool matches the channel/ocean-side viz.

### 2026-07-28 — Monterey Breakwater (first-hand, 7:45am) — UNDER-call ⚠️ (chl overshoot)
- **Reported:** "tale of two cities." Shallow **kelp forest ~15 ft**; along the wall and down to 45 ft **fluctuating 7–15 ft**, lots of particulate, greenish cloudy at depth. No surge, glassy/no waves. **60°F surface / 53°F at 45 ft.**
- **Tool `monterey` (live, same-day):** **3–5 ft (pea soup)**, 56°F, 1 ft surf.
- **Result:** **UNDER-call** ⚠️ (no overlap; tool ~2–10 ft low). The tool swung from clean 15–25 all week to pea-soup 3–5 on a **chlorophyll/particulate spike** — it correctly caught the green-up (confirmed: particulate + green at depth) but **overshot** when actual was a diveable 7–15. Temp: tool 56°F vs 60°F surface / 53°F deep — good.
- **Pattern / note:** recurring chl-penalty overshoot (cf. ljshores 7/18 2–4, ptlobos bloom → both fixed). Monterey Bay DOES get genuine pea-soup blooms (the 0–50 ft green-band), so I'm **not** capping it (would over-call a real bloom day) — but on a diveable-green day like today the chl-driven number runs too low, and Monterey's only NTU (the Wharf) reads harbor sediment, so it can't tell them apart. **Watch:** a 2nd Monterey chl-overshoot report → consider a Monterey-specific softening. Diver's tip: McAbee or Lover's Point for better viz.

### 2026-07-28 — La Jolla Shores (Scripps cam, 7:44pm) — MATCH ✅
- **Ground truth (Scripps pier cam):** **~11–13 ft** — hazy blue, near piling fouled/visible, particulate through the column.
- **Tool `ljshores` (live):** **8–13 ft**, 75°F, 2–3 ft surf.
- **Result:** **MATCH** ✅ (8–13 overlaps 11–13). Pier-anchored Shores tracking the cam well; SW swell keeping it hazy.

### 2026-07-28 — La Jolla Cove + Marine Room (aerial) — swell-driven murk
- **Aerials (today):** La Jolla Cove churning whitewater on the rocks; toward La Jolla Shores, visible murk and rough sea state from the swell; offshore still holding teal. Confirms the SW swell working the shallows — Cove/Shores stirred, cleaner water offshore. Consistent with `ljcove` staying low and the Shores 8–13 / cam 11–13.

### 2026-07-27 — La Jolla Shores (shop report) — MATCH ✅ (same-day)
- **Reported:** **8–12 ft** (up to 15 in the cleanest offshore water), SW swell **3–4 ft**, 70–72°F. Moderate SW swell stirring the shallow reefs/inside → greener, more suspended sand & particulate; cleanest blue held farther offshore.
- **Tool `ljshores` (live, same-day):** **8–13 ft**, 75°F, **3–4 ft surf**.
- **Result:** **MATCH** ✅ (8–13 vs 8–12/15, near-exact). Surf: tool 3–4 = reported 3–4 to the foot. Temp: tool 75°F vs 70–72°F surface (~3–5°F warm). The pier-anchored Shores is tracking well; the SW swell nudged it back from the weekend clearing — exactly the "stirred up the shallows" read.

### 2026-07-27 — Goff, Laguna (swim) — OVER-call ⚠️ (surf blowout)
- **Reported:** viz **1–5 ft**, waves **4–5 ft**.
- **Tool `treasureisland` (live, same-day):** **8–13 ft**, **4–5 ft surf**.
- **Result:** **OVER-call** ⚠️ (no overlap; tool ~3–12 ft high). The **4–5 ft surf blew out the shallow Goff reef** → 1–5 ft. The tool has the surf *right* (4–5 ft = reported) but its viz model doesn't crater enough for heavy surf on a shallow, exposed reef. Same shallow-surf-blowout theme as **Malaga Cove 7/26** (<5 in the surf) and **Flat Rock 7/20** (surgy/current over-call).
- **CANDIDATE (strengthening):** a **surf-driven viz dampener for shallow/exposed spots** — when surf is high (≥~4 ft) at a shallow reef/snorkel spot, viz should crater. Now 2–3 paired reports (Goff, Malaga, Flat Rock). Worth building once I can cleanly define "shallow-exposed" spots and a surf threshold; the tool already ingests the surf, it's just not penalizing viz for it.
- **FIX SHIPPED (7/27):** per Bret — Goff cove **faces straight south** and refracts swell off the side rocks, so a south swell is a direct hit. Config had it at `coast: 235` (SW) + `shelter: 'moderate'`, reading the direct hit as partly sheltered. Corrected to **`coast: 180` + `shelter: 'low'`**. Verified live: Goff **8–13 → 4–7 ft** in today's south swell (waveEnergy 233) — now overlaps the reported 1–5 (edge MATCH), no longer an over-call. This is the config-level version of the surf dampener for this spot; the general shallow-surf dampener is still a candidate for the others.

### 2026-07-26 — Del Monte Beach, Monterey Bay — MATCH ✅ (surface) + warm-water note
- **Reported:** **mega mola mola!** Water **super warm — 64°F at the surface** (sweating in a 7mm — very warm for Monterey). Vis **~20 ft from the surface, but hazy below ~20 ft depth.** Fun day.
- **Tool `monterey` (live, same-day):** **15–20 ft (green water)**, ~58°F.
- **Result:** **MATCH** ✅ (15–20 overlaps the ~20-ft surface read). The "hazy below 20 ft" is a deep haze band a single number can't split — an inversion of the usual clear-at-depth pattern. **Temp note:** tool ~58°F vs the diver's **64°F surface** — the surface has warmed ~6°F above the tool's SST source (marine-heatwave warmth pushing into Monterey; SST source lags the surface spike). A mola at Del Monte fits the warm-water signature.

### 2026-07-26 — La Jolla Shores (Katherine Mauser + reporter) — MATCH ✅ (bimodal)
- **Reported (AM):** two distinct vis zones. **North of the east wall: blueish 15–25'+** (could almost see the bottom at 30'), "everywhere north kind of awesome." **The "Vallecitos triangle" / V-point / along the wall: 0–10'** (bat rays digging divots, stirring sediment). **55°F at depth, 73°F surface.** Low-power surf, easy entry.
- **Tool `ljshores` (live):** **8–13 ft**, 73°F, chl 0.78, 2–3 ft surf.
- **Result:** **MATCH** ✅ (bimodal day) — 8–13 overlaps the murky Vallecitos zone (0–10 at 8–10) and sits just under the clean north (15–25). Single number lands between a genuinely two-zone day. **Temp exact (73°F surface).** Refines the LJ map: **clean north of the east wall, murky at Vallecitos / along the wall** (bat-ray-stirred).

### 2026-07-26 — La Jolla Marine Room (9:15–11:15) — UNDER-call ⚠️ (haircut over-suppressing as it clears?)
- **Reported:** **20+ ft in the AM** ("way better than the entire last 2–3 months!"), then ~10:30 the swell picked up, vis worsened, surface got choppy → exited. No GSB at the ¼ mi; schools of fish, timid topes.
- **Tool `ljmarineroom` (live):** **7–10 ft**, 73°F, chl 0.93, 1 ft surf (0.6× cove-pocket haircut applied).
- **Result:** **UNDER-call** ⚠️ for the morning peak (7–10 vs 20+). **CANDIDATE FINDING:** the 0.6× Marine Room/Cove haircut was added 7/20 during the *peak bloom*; now the bloom's gone (chl ~0.9) and MR cleared to 20+, so the haircut is holding it artificially low. Still correct for the *Cove* (drone-confirmed brown), but **MR may need the haircut relaxed when chl is low / water's clearing** → proposed fix: make the haircut **chl-aware** (full 0.6× during a bloom, ease it when chl is low). Flagging, not auto-tuning (1 clearing report; and MR *did* worsen after 10:30, so 7–10 fits the later state).

### 2026-07-26 — 425 / Rockpile (offshore SD) — fish/water intel
- **Reported:** not many paddies; **one yellowtail on a paddy spear**, one more trolling a rapala at Rockpile. Water **72–73°F**. "Viz not great from the islands south." Offshore intel — paddy bite thinning, green/murk line extends from the Coronado Islands south.

### 2026-07-26 — McAbee Beach, Monterey Bay (reported next day) — MATCH ✅ (near-exact)
- **Reported (yesterday AM, w/ Jim + Uncle E Benoni):** Vis **clear ~20 ft**; temp **52–60°F** (avg 54 — ~60 surface / 52 deep); max 59 ft (avg 35), 70 min. "Some of the most enjoyable conditions recently" — nice for the Shootout weekend. Surprise **halibut + a sea hare** on the way in.
- **Tool `monterey` (live, nearest-day):** **15–20 ft (green water)**, 58°F, 1 ft surf.
- **Result:** **MATCH** ✅ (near-exact — reported 20 sits at the top of 15–20). Temp: tool 58°F within the 52–60°F profile. Another Monterey Bay match — the tool's been dialed for Breakwater/McAbee all week.

### 2026-07-26 (PM) — La Jolla Shores (Scripps pier cam) — UNDER-call ⚠️ (narrowing; bloom cleared)
- **Ground truth (Scripps PIERViz pier cam, real-time):** **15–20 ft**.
- **Tool `ljshores` (live, same-day):** **8–13 ft**, 75°F, **chl 0.78** (down from 6.07 → 2.82 → 0.78), no live NTU (outage caveat showing).
- **Result:** **UNDER-call** ⚠️ but **edge/narrow** (tool top 13 vs cam bottom 15 — only ~2 ft short of overlap, vs the 15+ ft gaps earlier this week). The bloom has essentially cleared (chl 0.78), so the tool is climbing toward reality on its own; the residual gap is the missing turbidity sensor (can't fully confirm the clean water without NTU). The caveat is correctly flagging "clarity may be better — check the cam."
- **Drone-pilot aerial report (San Diego Snorkel Report, ~AM — footage was ~5 hrs before the 12:45 screenshots) — confirms the spatial split, spot by spot:** *"conditions all over the place. Clear blue waters at the Shores. Marine Room reef has every color of water. Brown water at the cove. White water at the Children's pool."*
  - **Shores = clear blue** → the pier-anchored `ljshores` sits in exactly this clean zone (cam 15–20, tool 8–13 climbing).
  - **Marine Room = every color** → the transition band (variable — clean-to-murky patchwork), the boundary between the clean north and murky south.
  - **Cove = brown water** → murky/sediment-laden; the `ljcove` 0.6× haircut correctly holds it low (5–8).
  - **Children's Pool = white water** → surf/whitewater on the rocks; matches the 3–4 ft surf, and the surge is what keeps the Cove/Children's sediment suspended.
  - Net: a textbook **north-clear → south-murk** gradient across ~1 mile. Strong validation of this week's two changes — the pier anchor (Shores = clean) and the cove dampener (Cove = brown). The one nuance the pilot adds: Marine Room is the *variable* seam between the two, "every color."

### 2026-07-26 — Malaga Cove, PV (snorkel, first-hand "Al") — OVER-call ⚠️
- **Reported:** snorkeled today, **viz terrible <5 ft**.
- **Tool `pv` (live, same-day):** **11–14 ft**, 73°F, 2–3 ft surf.
- **Result:** **OVER-call** ⚠️ (no overlap; tool ~6–9 ft high). Key factor: this is a **snorkel = shallow water**, which runs much murkier than the dive-depth number the `pv` spot models — Malaga Cove is a shallow reef/sand pocket that clouds up in any surf. PV is `currentProne` but today's current is low, so no dampener fired. Shallow-snorkel vs dive-depth is a known gap.

### 2026-07-26 — "2-turtle morning" (10–15 shallow / 25+ deep) — likely La Jolla → MATCH ✅ (shallow)
- **Reported:** viz **10–15 ft in the shallows, 25'+ AMAZING in the deep**. Two green turtles, first dive back from vacation. *(Spot not explicitly named; turtles + the shallow-murky/deep-clear split point to La Jolla.)*
- **Tool `ljshores` (live):** **8–13 ft**, 75°F. → **MATCH** ✅ (8–13 overlaps the shallow 10–15). The 25'+ deep is the offshore/canyon clearing the tool underreads with the Scripps sensor down — consistent with yesterday's cam (25–30). La Jolla's deep water is genuinely clearing.

### 2026-07-26 — La Jolla: offshore clear, Cove still murky (2nd-hand) — Cove MATCH ✅
- **Heard:** can see the bottom from the **¼-mi to ½-mi buoys** (offshore clear, ~30+ ft), but **still no vis in the Cove**.
- **Tool `ljcove` (live):** **5–8 ft** → **MATCH** ✅ — "no vis in the Cove" = the low tool number; the 0.6× cove haircut correctly holds the Cove low while offshore clears. Classic La Jolla split: clean offshore/canyon, murky Cove pocket. Second-hand — logged as intel.

### 2026-07-26 — Monterey Breakwater (night dive) — wildlife note (LOBSTER)
- A **lobster (~11–15 in)** at Breakwater, between mid reef and the wall — notable this far north (California spiny lobster is a SoCal species; a range-edge sighting in Monterey Bay). Night dive on doubles; harbor seals followed the light; waves looked sketchy on entry. No viz reported (wildlife-focused). Odd tail-tucked posture (possible eggs?).

### 2026-07-25 — Monterey Breakwater (grand circuit w/ Thomas) — MATCH ✅ (same-day)
- **Reported:** **barge wreck 25 ft · the wall 20 ft · metridium field 10–15 ft** (lots of particulate) · calm/clear in the shallows. Bottom temp **52°F**, 105 min run. Beautiful halibut over the sand; the resident wolf eel back in its hole at the barge wreck.
- **Tool `monterey` (live, same-day):** **18–23 ft (green tinge)**, 58°F surface, 1 ft surf.
- **Result:** **MATCH** ✅ — 18–23 brackets the dive (wall 20 dead-center, barge 25 just above, deep metridium 10–15 = the particulate low end). Temp: tool 58°F surface vs 52°F at the bottom — consistent thermocline.

### 2026-07-25 — Treasure Island / Goff, Laguna (surface look, NO dive)
- **Reported:** didn't get in — from the surface, viz "looks good." Air ~80s, water high 60s, surf mild **2–3 ft** but sets **up to 5 ft on the Goff reefs**.
- **Tool `treasureisland` (live):** **8–13 ft**, 72°F, **4–5 ft surf**. → Surf matches (tool 4–5 ≈ the 5-ft Goff reef sets); temp ~2–4°F warm. **No in-water viz to grade** (surface impressions read cleaner than horizontal viz) — logged as observation.

### 2026-07-25 — Offshore 302 → 182 → Nine Mile Bank (fish/water intel)
- **Reported:** water **72–74°F**, viz good **except north of the 9** (Nine Mile Bank); paddies still holding fish. **4 yellowtail + a dorado** (mahi — a warm-water pelatic, notable this far up). Not a viz grade — offshore fish/color intel for the weekly report; continues the warm blue-water-offshore pattern.

### 2026-07-25 (late PM) — La Jolla Shores (Scripps cam) — UNDER-call ⚠️ + validates pier anchor + caveat
- **Ground truth (Scripps PIERViz cam, real-time):** **25–30 ft** — near pilings razor-sharp, the far piling AND a fish visible well into the blue. Peak of the afternoon clearing (this morning's aerial was 8–12, mid-PM cam 20–25, now 25–30).
- **Tool `ljshores` (live, same-day):** **6–10 ft (green tinge)**, 75°F, chl 2.82, no live NTU.
- **Result:** **UNDER-call** ⚠️ (tool ~15–24 ft low) — the ongoing Scripps-sensor-outage limitation: chl-driven with no turbidity to catch the intraday clearing.
- **Two wins despite the miss:** (1) **the outage caveat is doing its job** — the tool is actively showing "⚠ Live turbidity sensor offline — actual clarity may be better than shown. Check the live cam," so a diver won't skip a clearing La Jolla on the 6–10. (2) **First cam reading since anchoring `ljshores` to the pier** — the cam IS the spot's location now, so this is a direct, apples-to-apples ground truth. chl also easing (6.07 → 2.82), consistent with the recovery.

### 2026-07-25 — La Jolla Shores + Cove (aerial, San Diego Snorkel Report) — Shores MATCH ✅, Cove MATCH ✅
- **LJ Shores (aerial):** looks **~8–12 ft** today, ~5 ft better than yesterday morning. Tool `ljshores` **5–8 ft (green water)**, 68°F, 2–3 ft surf. → **MATCH** ✅ (edge, at 8). Aerials read cleaner than in-water horizontal viz (top-down through the surface), so 5–8 in-water is consistent with an 8–12 top-down look. Caveat: tool held 5–8 (same as yesterday) — with Scripps NTU still down and chl steady (6.07), it can't "see" a day-to-day clarity bump, so it may run a touch low as SD water settles.
- **LJ Cove (aerial):** "rough and really nasty." Tool `ljcove` **4–5 ft (green water)**, **3–4 ft surf** (up from Shores' 2–3). → **MATCH** ✅ — poor/nasty confirmed; the 0.6× cove haircut keeps it appropriately low. Good validation.
- **Aerial notes:** brown muck piled along the cliffs from LJ Shores → past Marine Room → the Cove — swell-driven sediment resuspension + the ongoing surface bloom. Cove churning/foamy; clearly rougher than the Shores.

### 2026-07-25 (PM) — La Jolla Shores (Scripps underwater cam) — UNDER-call ⚠️ (afternoon clearing)
- **Ground truth (Scripps PIERViz underwater cam, real-time PM):** **~20–25 ft**, light-blue water — the back pilings and structure well beyond the near piling are clearly visible (a big step up from the ~8–12 ft aerial look this morning).
- **Tool `ljshores` (same-day AM capture):** **5–8 ft (green water)**, 68°F, 2–3 ft surf.
- **Result:** **UNDER-call** ⚠️ (no overlap; tool ~12–20 ft low) — **but this is the exact scenario this morning's note flagged:** with Scripps NTU still down and chl steady (6.07), the tool can't "see" a same-day clarity bump, so it ran low as the SD water settled through the day. La Jolla was called as the first spot to recover, and it did — the Cove/Shores stretch cleared into the afternoon after the swell eased. Good validation of the recovery call, honest miss on the tool's magnitude (it's anchored to a stale/steady chl signal with no live turbidity to catch the clearing).
- **Reported (7/24):** **8–12 ft**; surf moderate with the occasional 4–5 ft set (had to time the entry to avoid a tumble cycle). Usual crowd — kelp bass, halfmoons, opaleye, zebra perch, garibaldi — plus a fast school of yellowfin. No leopard sharks/rays (conditions not as good as Doug's dive ~a week ago).
- **Tool `crescent` (live, same-day):** **8–13 ft**, 73°F, 2–3 ft surf.
- **Result:** **MATCH** ✅ (8–13 vs 8–12, near-exact). Notable: Crescent has been a repeat **surge-murk over-call** spot on calm-looking days — today it's genuinely clean and the tool nailed it. Surf: tool 2–3 ft base vs the occasional 4–5 ft sets — reasonable.

### 2026-07-24 — La Jolla Shores (SD shop / Scripps cam) — MATCH ✅ (same-day)
- **Reported (7/24):** **5 ft, green**; swell up **3–4 ft** across San Diego; **70–72°F**. Scripps pier cam ~5 ft. Divers calling it "not worth the drive."
- **Tool `ljshores` (live, same-day):** **5–8 ft (green water)**, 69°F, 2–3 ft surf.
- **Result:** **MATCH** ✅ (5 at the low edge of 5–8). Green matches; temp ~1–3°F low; swell building (tool 2–3 vs reported 3–4). Consistent with yesterday's 4–8 ft cam → SD holding poor/green as swell fills in.

### 2026-07-23 — La Jolla Shores (Scripps underwater cam) — MATCH ✅ (same-day)
- **Ground truth (Scripps PIERViz underwater cam, real-time):** **~4–8 ft** visibility, green water.
- **Tool `ljshores` (live, same-day):** **3–5 ft (green water)**, 71°F.
- **Result:** **MATCH** ✅ (3–5 overlaps 4–8 at 4–5). Tool sits at the low edge but in-band. Notable: Scripps NTU sensor still offline (temp via La Jolla NOAA gauge, no live turbidity — the source-health indicator flags both), yet the chl-driven 3–5 correctly tracked the degraded cam viz. Conditions genuinely dropped (shop had 8–12 on 7/22 → 4–8 now) — not a tool error, and no bloom-cap needed (ljshores isn't a bloomSheltered headland; the penalty is appropriate here).

### 2026-07-23 — Monterey Breakwater (wall) — MATCH ✅ (same-day)
- **Reported (7/23, just after noon, rising tide):** viz **15–25 ft**, nicest between 5–15 ft depth; **59–60°F**. Lots of YOY olive/yellowtail rockfish in the canopy with bocaccio YOY hunting them; more sea-lion activity than recent weeks.
- **Tool `monterey` (live, same-day):** **21–26 ft (bloom season)**, 57°F, flat.
- **Result:** **MATCH** ✅ (21–26 overlaps 15–25). Temp: tool 57°F vs 59–60°F (~2–3°F low).

### 2026-07-22 — Breakwater (PM) + Veterans Park (night) — nearest-day
| Spot | Reported (7/22) | Tool (7/23 nearest-day) | Result |
|---|---|---|---|
| Breakwater PM → `monterey` | 10–15 shallow / 5–10 beyond 24 ft typical, **~25 ft at best** (per Bret), heavy particulate, little swell/waves | 21–26 (bloom season) | **MATCH** ✅ |
| Vets Park night → `veteranspark` | **3–5 ft at ≤40 ft, cleared up to a nice dive deeper (~50 ft)** after a day of building swell | 6–11 | **MATCH** (mid-column) |

- **Breakwater — MATCH both days (corrected 7/23):** Bret confirms 7/22 PM best viz was **~25 ft**, which overlaps the tool's 21–26 per the overlap rule (occasional/best pockets count). So the tool's 21–26 was consistent AND correct across both days (7/22 best 25, 7/23 15–25). Initial 5–15 over-call read was wrong — I graded off the typical/deep figures instead of the best. Reinforces: use the **real per-spot best**, don't downgrade on the murky-deep number.
- **Vets Park:** classic Santa Monica Bay thermocline stratification — murky shallow (3–5), clearer below (~50 ft). Tool 6–11 sits mid-column between the two. Swell-driven surface murk on entry/exit.

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

### 2026-07-16 — Veterans Park, Redondo (Thu)
- **Observed:** surface 67°F; viz ~10 ft in the shallows, ~15 ft in the canyon beyond the 35' range; thermocline 67→62°F, down to 56°F at 90'; viz ~15 ft at that depth. Winds stirring things up; "not much change."
- **Tool grade:** N/A — no 7/16 same-day snapshot captured for `veteranspark` (LA County). Reading it now (7/18) would be a different day, so logged as observation only. Classic Santa Monica Bay stratification (clearer/colder below the thermocline) — matches the spot's config notes.

### 2026-07-18 — LJ Marine Room/Cove + Laguna (Heisler, Crescent) — same-day vs live tool
| Spot | Reported (7/18) | Tool (7/18, live) | Result |
|---|---|---|---|
| LJ Marine Room, 7am shallows | 10–14 ft | 14–19 | MATCH (edge, at 14) |
| LJ Marine Room → Cove, 9–11am | 5–12 ft ("lousy" whole way, only somewhat decent at Caves/Cove) | 14–19 | **OVER-call** ⚠️ |
| Heisler Park (Laguna) | 10–20 ft, mild swell when sets roll in | `laguna` 14–19 | **MATCH** ✅ |
| Crescent | 15–20 ft (seal, octopus, two horn sharks) | 14–19 | **MATCH** ✅ |

- **Marine Room over-called AGAIN** (7/17 was also an over-call). Tool 14–19 vs actual 10–14 → 5–12 through the morning. This is now a repeated, high-confidence signal: the tool over-reads Marine Room on warm/particulate days despite its `coveTrap` dampener. Candidate: strengthen the warm-surface-particulate penalty specifically for `ljmarineroom` (and likely `ljcove`, which ran "somewhat decent" ≈ 10–12 vs tool 14–19).
- **Laguna coves matched well** — Heisler (10–20) and Crescent (15–20) both overlap 14–19. Crescent clean today vs the surgy/murky 7/17.

### 2026-07-18 — Point Loma + offshore banks (302→371)
| Spot | Reported (7/18) | Tool (7/18, live) | Result |
|---|---|---|---|
| Point Loma | hazy 15–20 ft (cleaner in the AM), 70–71°F, "not super fishy" | 14–19, 72.7°F | **MATCH** ✅ (temp ~2°F warm) |
| Offshore 302→371 (Nine Mile Bank +) | viz good offshore, **green from Nine Mile Bank in**; 71–72°F | `ninemile` 14–19, 74.3°F | Offshore/fish intel; tool's 9 Mile 14–19 ≈ the green→blue transition described |

- **Offshore fish note (for weekly report):** 3 yellowtail to 25 lb on kelp paddies out at the 302→371; blue water past Nine Mile Bank, green inshore of it; 71–72°F. "Solid amount of paddies holding fish." (Also: lots of inconsiderate boat traffic at Point Loma.)

### 2026-07-19 — La Jolla Cove (CONFIRMED, first-hand) + Marine Room
| Spot | Reported (7/19, first-hand) | Tool (7/19, live) | Result |
|---|---|---|---|
| La Jolla Cove (¼ & ½ mi buoys), 8–10am | **8–12 ft, poor, lots of particulates**; some sets | `ljcove` 14–19 | **OVER-call** ⚠️ |

- **Confirms the ¼-mile-outside-the-Cove proxy.** Yesterday's second-hand ~10 ft guess is now backed first-hand at **8–12 ft** (Bret uses viz ¼ mi outside the Cove to predict La Jolla Cove). Tool over-called at 14–19.
- Same swim: **best viz at Sunny Jim's cave & east along the caves; worst at Devil's Slide (2', brownish).** Marine Room shallow reef "ok, like yesterday" — consistent with the ongoing MR over-call.
- Pattern now: **La Jolla Cove joins Marine Room** as a warm/particulate over-call spot vs the tool's 14–19.
- (A separate non-first-hand 7/19 Marine Room report was set aside per Bret. MR first-hand over-call: 7/17–7/18.)

### 2026-07-18 — Catalina + misc observations (no same-day tool snapshot)
- **Flat Rock (Palos Verdes — NOT Catalina; maps to `pv`):** viz 15–18 ft; 70°F surface, 68°F at 25'.
- **Avalon wreck (Catalina):** 70°F surface, nice blue hue to ~40', then a **15-ft layer of brown crud**, viz opening back to ~20 ft at 65'. Squirrely currents at both sites.
- **Unnamed (7/18 "yesterday's dive"):** dive-watch showed **21 ft viz**, "so much better than expected," lots of leopard sharks. **Location not stated** — leopard-shark numbers suggest La Jolla Shores/Marine Room, but unconfirmed. Logged as observation.
- (Heisler Park 10–20 report received again — **duplicate** of the 7/18 Heisler entry above, already logged/graded as MATCH; not re-logged.)

### 2026-07-18 — additional observations (no same-day tool snapshot)
- **Mission Bay Jetty** ~1:30pm — murky; stayed near the rocks for best viz; water warm. Saw critters.
- **Outer Pinnacles (Monterey, Bay Area Deco Assoc. tech charter), 130–155 ft** — glassy, extremely mild swell, no current. **Nasty green algae layer 0–50 ft; dark but clear below.** 61°F on deco, 52°F on the bottom. Great structure/diversity.
- **Monterey Bay Breakwater** — 20–25 ft; viz *improved* through the day (unusual).
- **Breakwater (Women's Dive Day)** — 10–12 ft AM → 15–18 ft afternoon; 57°F at 25 ft early, 55°F at 25 ft afternoon. Calm.
- Note (Monterey): green-algae surface band 0–50 ft with clear water beneath is the same stratified-bloom signature as the tech-charter report — consistent bay-wide 7/18.

### 2026-07-18 & 2026-07-19 — Point Lobos (Carmel), Shootout practice w/ Lindsay Jordan
Weekend of prep dives before next weekend's Shootout. **No exact same-day tool snapshot captured** for those dates (tool only forecasts forward); graded against the nearest capture — the 7/17 Carmel/Point Lobos snapshot **12–17 ft (green), 57°F**.
| Day | Reported | Tool (7/17 snapshot) | Result |
|---|---|---|---|
| Sat 7/18 | **40+ ft at depth**, better than expected, 51°F, minimal surge | 12–17 (green) | **UNDER-call** ⚠️ (nearest-day; tool ~23+ ft low) |
| Sun 7/19 | "a bit worse" than Sat (still strong), 51°F, minimal surge | 12–17 (green) | **UNDER-call** ⚠️ (nearest-day) |

- **Temp:** 51°F reported is the **at-depth** temp; surface is a warm lens (Diablo/CDIP 076 buoy reading ~57–59°F surface this window). So the 57°F snapshot isn't a clean temp miss — different layers.
- **Pattern:** Point Lobos joins **Hopkins** as a consistently-clearer-than-tool Central Coast micro-spot. The single `carmel` entry (green/bloom-penalized 12–17) under-calls these clean, structure-rich sites — same limitation flagged for Hopkins vs `monterey` 7/17.
- **Wildlife (weekly-report material):** Sat scootered to **Beto's** — Beto the wolf eel photographed (macro), plus the biggest **Sea Lemon** (nudibranch) the reporter had ever seen. Sun ran to **Marco's Pinnacle** (spot found ~2 wks ago), abundant/diverse fish.

### 2026-07-19 — Offshore 302 / Nine Mile Bank (fish + water-color intel)
- **Reported:** green water has **moved further out**; **blue water now ~5 miles west of the Nine Mile Bank ("the 9")**. Lots of kelp paddies but **only holding small yellowtail**.
- **Not a viz grade** — offshore fish/water-color intel. Continues the 302→371 thread from 7/18 (blue past Nine Mile, green inshore). Shift since 7/18: green pushed farther offshore (blue line receding west of the 9), and paddy fish have downsized (small yellows vs the 3 yellows to 25 lb on 7/18).
- **For weekly report:** paddy bite gone small offshore; blue water retreating west of Nine Mile Bank.

### 2026-07-20 — Flat Rock (Palos Verdes) — same-day, live tool — OVER-call ⚠️
- **Reported (Mon 7/20):** viz **8–10 ft**, surgy; **2–3 knot current at the surface AND at 25 ft**; **68°F** at 25 ft.
- **Tool `pv` (live, same-day):** **18–23 ft**, 74°F surface, 1–2 ft surf.
- **Result:** **OVER-call** ⚠️ (no overlap; tool ~8–13 ft high). Temp: tool 74°F is the warm surface lens; reported 68°F is at 25 ft — different layers, not a clean miss.
- **Why the miss:** a **2–3 kt current running top-to-bottom** is stirring sediment / driving surge-murk — the tool reads a calm 1–2 ft surf day and has no current input, so it over-calls. Same theme as the Crescent surge-murk and warm-particulate over-calls: the model under-weights viz loss from current/surge on otherwise "clean-looking" days. (**NB: Flat Rock = Palos Verdes**, not Catalina — maps to `pv`.)

### 2026-07-19 — La Jolla Shores (Katherine Mauser) — stratified bloom, improving
- **Reported (Sun 7/19 AM):** near-flat "Lake La Jolla" surface w/ the odd wave. Swam through brown surface **gunk** ("ocean diarrhea" — unknown, doesn't smell/appears non-fecal). Descended into **gunky greenish cloudy** vis that **improved with depth — noticeably better by 40 ft, 20–30 ft below ~70 ft.** Vis worsened again around the wall / Vallecitos (bat rays or a big school of young barred sand bass churning it).
- **Tool `ljshores` (live 7/20, ~next-day):** **11–16 ft (green tinge)**, swell 2–3 ft.
- **Result:** **MATCH** ✅ (mid-column) — the tool's 11–16 sits between the gunky surface (~5–10) and the clear deep (20–30); overlaps the transition. Single number can't express the stratification, but it's in-band.
- **Big picture:** on **7/18** the tool over-penalized `ljshores` to **2–4 "pea soup"** (logged UNDER-call vs Scripps cam 10–12). Two days later it reads **11–16** — the chl/bloom penalty has **eased**, matching the reporter's "snot-a-palooza abating" (gorgonians in the garden **no longer snot-covered**; lots of nudis, 2 adult horn sharks). Good sign the aggressive chl-viz penalty self-corrected as the bloom faded.

### 2026-07-21 — Monterey Peninsula (Stillwater Cove + Coral Street) — mixed
| Spot | Reported (7/21) | Tool (7/21, live) | Result |
|---|---|---|---|
| Stillwater Cove, Pebble Beach → `carmel` (Carmel Bay) | **rough, 3–5 ft** | 14–19 ft (est.), 55°F | **OVER-call** ⚠️ (no overlap; ~9–16 ft high) |
| Coral Street, Pacific Grove → `loverspoint` | **10–15 ft** ("a little better") | 15–20 ft (green water), 61°F | **MATCH** ✅ (edge, at 15) |

- **Stillwater over-call:** Stillwater is normally a protected Carmel-Bay cove, but it fished **rough** today — surge/swell-driven murk the `carmel` entry doesn't catch. `carmel` is wave-energy-based (`(est.)`, **no live turbidity sensor**) and read a calm 1–2 ft surf, so it leans optimistic on rough days. Same surge-murk blind spot flagged at Crescent/PV — and the whole Central Coast lacks NTU sensors, so these spots can't see localized stir.
- **Coral Street:** `loverspoint` 15–20 overlaps the reported 10–15 at the edge → MATCH. Note **`hopkins` read 26–31 (bloom season)** today — that would badly over-call the more-exposed Coral Street, so `loverspoint` is the better analog for it. (No fish either dive.)

### 2026-07-19 — Mission Point Park (MPP) jetty — observation (no same-day snapshot)
- **Reported (Sun 7/19):** viz **5–10 ft on the channel side, ~5 ft (murkier) on the bay side**. Water very warm — only a 3mm, comfortable for a 2 hr dive. Highlight: a super-chonky **California chromodorid (Felimare californiensis)** nudibranch.
- No same-day tool snapshot (past date); Mission Point / Mission Bay maps closest to the `mission` spot, which the tool doesn't retain for 7/19 — logged as observation. The **channel-side > bay-side clarity split is expected**: the enclosed bay is shallow/warm/particulate-laden vs the ocean-flushed channel. Consistent with the region-wide warm-water spell (3mm comfort echoes the 69–74°F we've logged all week). *(Re-sent 7/22 — already logged; name refined MPP = Mission Point Park.)*

### 2026-07-22 — Point Lobos (3 dives: Hole in the Wall, Tom Lohmuller, Kevin Chen) — nearest-day UNDER-call ⚠️
Three independent Point Lobos dives, all 7/22, all green + heavy particulate despite ~no swell:
- **Hole in the Wall (PM):** **pitch black at 70 ft** (a daytime night dive); **Middle Reef ~15 ft**.
- **Tom Lohmuller:** **10 ft at depth**, green + lots of particulates (virtually no swell); **shallow/cove 15–20 ft**. Min temp **56°F**.
- **Kevin Chen (runtime 1:37, max 93 ft, avg 45):** **~20 ft shallow dropping to ~10 ft at depth**; blue haze to the south, dark green to the north. **57°F max / 55°F min.** Highlight: a **20+ ft salp chain**. Reached Hole in the Wall + Sea Mount/Beto's.
- **Consensus:** cove/shallow 15–20 ft → ~10 ft at depth → near-black in the deepest pockets; green, heavy particulate, calm.
- **Tool `ptlobos` (nearest-day, 7/23 live):** **3–5 ft (pea soup)**, 58°F, ⚠️ no live turbidity.
- **Result:** **UNDER-call** ⚠️ (nearest-day) — tool 3–5 is well below the reported 10–20 shallow/general (it *does* match the pitch-black deep pockets). Directionally right (sees degraded/green) but far too aggressive on magnitude.
- **Two tool flags (watch items — Central Coast has no NTU sensors; not fixing on next-day data):**
  1. `ptlobos` read **3–5 pea soup despite its `bloomSheltered` flag** — the chl/bloom penalty (worker-side, where the hero is computed) is over-aggressive for a headland spot with no live NTU to anchor it. Same aggressive-chl signature as ljshores on 7/18 (2–4 pea soup).
  2. **Cross-spot inconsistency:** same day/region the tool split **Point Lobos 3–5 vs Monterey Bay 21–26**, but the actual reports were *similar* (~15–20 shallow, both green). The spread between the two Central Coast entries is far too wide.
- Temps: reports 55–57°F vs tool 58°F → ~MATCH.
- **FIX SHIPPED (7/23):** diagnosed via worker A/B — the worker **ignores the `bloomSheltered` flag**, and an extreme satellite chlorophyll (24 mg/m³) with **no live NTU** to corroborate it crushed viz to pea soup (chl 24→3–5; chl 10→12–17). Now **cap the chl fed to the viz model at 10** for bloomSheltered headlands with no turbidity (Point Lobos, Hopkins), excluding scrippsProximity cove spots (ljcove) and respecting redTideWarning. Verified: `ptlobos` **3–5 → 12–17** (matches the 10–20 reports), `hopkins` protected from pea soup (17–22), `ljcove` untouched (4–7).

### 2026-07-22 — Monterey Breakwater (ADC / Underwater Voyagers, evening) — nearest-day OVER-call ⚠️ (edge)
- **Reported (7/22 PM):** flat, high tide, calm; **15–20 ft viz, dark & snotty in patches**; air 73°F, **avg water 59°F**; open-cell 7mm, kicked to marker 7; schools of rockfish in kelp, calico bass, perch, decorator crabs; 44 min, easy exit w/ 1600 psi.
- **Tool `monterey` (nearest-day, 7/23 live):** **21–26 ft (bloom season)**, 58°F, flat.
- **Result:** **OVER-call** ⚠️ (edge, nearest-day) — tool 21–26 sits just above the reported 15–20 ceiling (~1–6 ft high). Temp near-exact (58 vs 59°F). The "dark & snotty patches" are the particulate/bloom the tool's high "bloom season" read doesn't reflect.

### 2026-07-22 — La Jolla Shores (shop daily report) — MATCH ✅
- **Reported (shop admin, 7/22):** viz **8–12 ft**, green with a moderate amount of particulate; swell **1–2 ft**, light W wind, easy shore entry, very little surge; surface temp **70–72°F**. Best window is the morning before the wind builds; protected areas cleanest.
- **Tool `ljshores` (live, same-day):** **6–10 ft (green tinge)**, 2–3 ft surf, **75°F (La Jolla NOAA gauge)**.
- **Result:** **MATCH** ✅ (6–10 overlaps 8–12 at 8–10). Green-tinge + moderate-particulate read matches the shop's description.
- **Temp note:** tool gauge reads **75°F this afternoon** vs the shop's **70–72°F morning** figure — that's diurnal surface warming (the gauge is now correctly tracking the local La Jolla surface after the 7/22 temp-source fix), not a source error. Yesterday's diver saw 76°F surface here, so 75°F is right in line. Swell: shop 1–2 ft vs tool 2–3 ft breaking estimate — consistent.

### 2026-07-21 — La Jolla Shores (first-hand, Katherine Mauser + reporter) — MATCH ✅ (mid-column)
- **Reported (Mon 7/21):** mild surf, easy entry; surface had **nonstop short-interval swell + wind chop**. Surface "ocean barf" gunk **sparser than last time** (the 7/19 "ocean diarrhea" clumps are breaking up). Vis better but still cloudy and **worse the shallower you go**: **garden 20–30 ft, slope-up 20–30 ft, around the wall 10–20 ft, above Vallecitos 5–10 ft.**
- **Temp:** **76°F surface (!), 56°F at 113 ft** — a big ~20°F thermocline.
- **Tool `ljshores` (7/21 same-day snapshot):** **11–16 ft (green tinge)**, 74°F surface.
- **Result:** **MATCH** ✅ (mid-column) — tool 11–16 overlaps the wall zone (10–20) and sits between the murky shallows (5–10) and the clear garden (20–30). One number can't express a 5→30 ft depth-stratified column, but it lands in-band. Same stratified pattern as the 7/19 Shores dive.
- **Notables:** the **76°F surface confirms the warm-lens peak** the CO-OPS La Jolla gauge showed (76.1°F on 7/20) — and validates the temp-source fix (tool now reads the local La Jolla gauge, not Newport 30 mi north). Bloom **still easing** (gunk sparser). **Lots of halibut** big & small; **juvenile California Sheephead** ("Monday fish" — seasonal recruitment); hunted the garden's south side for Treefish, no joy.

### 2026-07-21 — La Jolla Shores (Scripps Pier live cam) — MATCH ✅ (near-exact)
- **Ground truth (Scripps PIERViz live underwater cam @ ~13 ft, coollab.ucsd.edu / Coastal Ocean Observing Lab):** the **14-ft back-left piling is clearly visible in light-blue water**, with faint structure beyond. Per the cam's piling-distance calibration (pilings at 4 / 11 / 14 / 30 ft; the 14-ft piling shows "only when calm and clear, light blue water") → **~12–16 ft**.
- **Tool `ljshores` (live, same-day):** **11–16 ft (green tinge)**.
- **Result:** **MATCH** ✅ — tool 11–16 vs cam 12–16, near-exact. (Cam water reads more blue than the tool's "green tinge" label, but the clarity range is dead-on.) Strong validation of the untouched Shores baseline.

### 2026-07-21 — LJ Shores → Marine Room → Cove aerial (public reel) — directional + fix check
- Public aerial reel (San Diego Snorkel Report) of the Shores→Marine Room→Cove stretch: **green/teal water with reef & kelp structure visible from above** through the shallows, a lighter sediment band in the surf zone, deepening to blue-green offshore. Directionally consistent with the tool's green-tinge, moderate-viz regime (a top-down aerial reads a touch cleaner than a diver's horizontal viz).
- **Cove/Marine Room fix verified live:** with the 7/20 haircut, `ljmarineroom` **worker raw 11–15 → displayed 7–9** and `ljcove` **7–9**, vs the untouched `ljshores` 11–16. Confirms the 0.6× is firing on the same-day hero for both cove-pocket spots and nowhere else.

### 2026-07-20 — La Jolla Cove — OVER-call ⚠️ (4th straight day)
- **Reported (Mon 7/20):** **5–7 ft in the kelp forest at depth, ~10 ft in the shallows.** Water very warm, **69–72°F**.
- **Tool `ljcove` (live, same-day):** **11–16 ft (green tinge)**, 74°F surface, 1–2 ft surf, current 0.6 kt.
- **Result:** **OVER-call** ⚠️ (tool low end 11 sits just above the reported 10-ft ceiling — no overlap; ~1–6 ft high). Temp: tool 74°F surface vs 69–72°F reported — warm-lens theme again.
- **PATTERN — La Jolla Cove has now over-called 4 days running (7/17, 7/18, 7/19, 7/20):** actuals ran ~8–12, then 8–12, then 5–12, now 5–10, while the tool read 14–19 → 14–19 → 14–19 → 11–16. The chl penalty has eased the tool down from 14–19 to 11–16, but it **still over-reads the Cove on warm/particulate days.** This is a high-confidence, ≥3-report spot-structural bias (exactly the case for a per-spot fix — the existing `ljcove` 0.6× NTU dampener lives in the local forecast path but the same-day hero comes from the worker, which isn't applying an equivalent Cove-specific haircut).
- **FIX SHIPPED (7/20):** mirrored the forecast path's **0.6× Cove/Marine Room haircut into the today-hero path** (client-side, after the worker, before calibration). Verified live: `ljcove` and `ljmarineroom` **11–16 → 5–8 ft** (now MATCHES today's 5–10 report), while `ljshores` and all other spots are untouched. Applies to both cove-pocket spots to keep today consistent with the forecast.

### 2026-07-19 — Point Loma — MATCH ✅ (+ shaped the new current dampener)
- **Reported (Sun 7/19):** **10–15 ft, with 20 ft at some spots out at the kelp.**
- **Tool `pointloma` (live 7/20, ~next-day):** **9–14 ft (green tinge)**.
- **Result:** **MATCH** ✅ (9–14 overlaps 10–15). The 20-ft kelp pockets are a clearer micro-zone the single number sits just below — tool on the low side but in-band.
- **Why it matters for the tool:** Point Loma's **model surface current was 1.5 m/s (2.9 kt)** on 7/19 — very strong — yet viz was **good**. This is the key counterexample proving strong current ≠ murk at a rocky headland (clean offshore water rides the current). It's why the new current-viz dampener (2026-07-20) is **opt-in per spot (`currentProne`)**, not universal — a blanket dampener would have wrongly under-called Point Loma here. Only sediment/shallow points like Flat Rock/PV are flagged.

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
