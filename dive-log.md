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
