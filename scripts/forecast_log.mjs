#!/usr/bin/env node
/**
 * forecast_log.mjs — capture the tool's forward viz forecast for accuracy scoring.
 *
 * WHY: every dive-log grade so far is a same-day NOWCAST. The forward 7-day
 * forecast has never been measured. The tool forecasts the physical drivers
 * (swell height/period, wind, tide) but FREEZES today's chl/turbidity forward
 * (it can't predict a bloom breaking/intensifying). This logs what the tool
 * predicts today for each future day so that — paired with the cam-viz actuals
 * the cam pipeline already logs — we can build a real forecast scorecard:
 * "on 8/4 the tool forecast 8/6 = X ft; on 8/6 the cam actually showed Y ft."
 *
 * It scrapes the DEPLOYED tool with a headless browser (the forecast is computed
 * client-side, so there's no server endpoint). For each spot it reads every
 * forecast day's viz range (.ftc-viz-feet, 3 slots) + swell summary (.fp-summary)
 * and emits one CSV row per (spot, horizon day).
 *
 * Output columns:
 *   captured_at_utc, spot, forecast_for_date, horizon_days,
 *   viz_lo_ft, viz_hi_ft, swell_ft, swell_period_s, swell_dir_deg
 *
 * Usage:  node scripts/forecast_log.mjs [--url <site>] [--spots a,b,c]
 */
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const getArg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SITE = getArg('--url', 'https://conditions.spearfactor.com/');

// spot id -> county dropdown value (locationSelect only holds the selected county's spots)
const SPOT_COUNTY = {
  ljshores: 'sandiego',   // has the co-located cam ground truth — the key spot
  monterey: 'monterey',
  crescent: 'orange',
  catalina: 'catalina',
};
const SPOTS = getArg('--spots', Object.keys(SPOT_COUNTY).join(',')).split(',').map(s => s.trim()).filter(Boolean);

const nowUtc = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const dateOnly = d => d.toISOString().slice(0, 10);
const parseRange = t => {            // "12–17 ft" / "45+ ft" -> [lo,hi]
  const m = String(t).match(/(\d+)\s*[–-]\s*(\d+)/);
  if (m) return [Number(m[1]), Number(m[2])];
  const s = String(t).match(/(\d+)\+?/);
  return s ? [Number(s[1]), Number(s[1])] : [null, null];
};

async function readForecast(page, spot) {
  const county = SPOT_COUNTY[spot];
  await page.selectOption('#countySelect', county);
  await page.waitForTimeout(1500);
  await page.selectOption('#locationSelect', spot);
  // Wait for the forecast to build AND settle (it re-renders after the straggler
  // chl/turbidity fetch). Poll fDay0's viz until it's a real number and stable.
  let prev = null;
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(2500);
    const cur = await page.$eval('#fDay0 .ftc-viz-feet', el => el.textContent.trim()).catch(() => '');
    if (/\d/.test(cur) && cur === prev) break;
    prev = cur;
  }
  return page.evaluate(() => {
    const days = [...document.querySelectorAll('#forecastDays .forecast-day')];
    return days.map((d, idx) => {
      const vizTexts = [...d.querySelectorAll('.ftc-viz-feet')].map(e => e.textContent.trim());
      const swell = (d.querySelector('.fp-summary') || {}).textContent || '';
      return { idx, vizTexts, swell };
    });
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.goto(SITE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#locationSelect', { timeout: 30000 });

  const rows = [];
  const captured = nowUtc();
  const today = new Date();
  for (const spot of SPOTS) {
    try {
      const days = await readForecast(page, spot);
      for (const day of days) {
        // day viz = widest bracket across the day's slots
        const los = [], his = [];
        for (const t of day.vizTexts) { const [lo, hi] = parseRange(t); if (lo != null) { los.push(lo); his.push(hi); } }
        const vizLo = los.length ? Math.min(...los) : '';
        const vizHi = his.length ? Math.max(...his) : '';
        const sm = String(day.swell).match(/([\d.]+)ft\s*·\s*(\d+)s\s*·\s*\D*(\d+)°/);
        const [sFt, sPer, sDir] = sm ? [sm[1], sm[2], sm[3]] : ['', '', ''];
        const target = new Date(today.getTime() + day.idx * 86400000);
        rows.push([captured, spot, dateOnly(target), day.idx, vizLo, vizHi, sFt, sPer, sDir].join(','));
      }
      console.error(`[ok] ${spot}: ${days.length} forecast days`);
    } catch (e) {
      console.error(`[fail] ${spot}: ${e.message}`);
    }
  }
  await browser.close();

  const header = 'captured_at_utc,spot,forecast_for_date,horizon_days,viz_lo_ft,viz_hi_ft,swell_ft,swell_period_s,swell_dir_deg';
  if (rows.length === 0) { console.error('no rows captured'); process.exit(1); }
  process.stdout.write(header + '\n' + rows.join('\n') + '\n');
}

main().catch(e => { console.error(e); process.exit(1); });
