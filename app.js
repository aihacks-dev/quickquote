const APP_VERSION = "v3";

// -------------------- Constants --------------------
// 40% half dollar silver content (ASW, troy oz)
const ASW_40_HALF = 0.1479;

// 90% conversion factors (per $1.00 face value)
const ASW_90_PER_DOLLAR_WORN = 0.7150;  // worn avg
const ASW_90_PER_DOLLAR_BU   = 0.7234;  // BU / less-worn

// Pre-33 gold AGW (troy oz)
const PRE33_AGW = {
  g25: 0.12094,
  g5:  0.24187,
  g10: 0.48375,
  g20: 0.96750
};

// AGE gold weights (troy oz)
const AGE_AGW = {
  age10:  0.10,
  age25:  0.25,
  age50:  0.50,
  age100: 1.00
};

// -------------------- DOM helpers --------------------
const el = (id) => document.getElementById(id);

// Version label
el("version").textContent = APP_VERSION;

// Inputs
const spotSilver = el("spotSilver");
const spotGold   = el("spotGold");
const discount   = el("discount");
const discountLabel = el("discountLabel");
const outDisc = el("outDisc");
const use715 = el("use715");

// Silver counts
const h90 = el("h90");
const q90 = el("q90");
const d90 = el("d90");
const h40 = el("h40");
const ozOtherSilver = el("ozOtherSilver");
const rounds = el("rounds");
const ase = el("ase");

// Gold counts
const g25 = el("g25");
const g5  = el("g5");
const g10 = el("g10");
const g20 = el("g20");
const age10  = el("age10");
const age25  = el("age25");
const age50  = el("age50");
const age100 = el("age100");

// Buttons
const saveBtn  = el("saveBtn");
const clearBtn = el("clearBtn");
const status   = el("status");

// Outputs
const outFV90     = el("outFV90");
const outFV40     = el("outFV40");
const outFVTotal  = el("outFVTotal");
const outBullionOz = el("outBullionOz");

const outAsw       = el("outAsw");
const outSilverMelt= el("outSilverMelt");
const outAgw       = el("outAgw");
const outGoldMelt  = el("outGoldMelt");
const outTotal     = el("outTotal");
const outOffer     = el("outOffer");

// Everything that should trigger recalculation on input
const recalcInputs = [
  spotSilver, spotGold, discount, use715,
  h90, q90, d90, h40, ozOtherSilver, rounds, ase,
  g25, g5, g10, g20, age10, age25, age50, age100
];

// -------------------- Parsing/formatting --------------------
function parseNum(v) {
  const raw = (v || "").toString().replace(/[$,\s]/g, "").trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function parseIntSafe(v) {
  const raw = (v || "").toString().replace(/[^\d-]/g, "").trim();
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

function money(n) {
  return (Number.isFinite(n) ? n : 0).toLocaleString(undefined, { style:"currency", currency:"USD" });
}

function fmt(n, digits=2) {
  return (Number.isFinite(n) ? n : 0).toFixed(digits);
}

function updateDiscountLabel() {
  const d = parseNum(discount.value);
  discountLabel.textContent = `${d}%`;
  outDisc.textContent = `${d}`;
}

// -------------------- Core calculation --------------------
function calc() {
  updateDiscountLabel();

  const sSpot = parseNum(spotSilver.value);
  const gSpot = parseNum(spotGold.value);
  const dPct  = parseNum(discount.value) / 100;

  // ---- 90% FV ----
  const halves90  = parseIntSafe(h90.value);
  const quarters90= parseIntSafe(q90.value);
  const dimes90   = parseIntSafe(d90.value);

  const fv90 =
    halves90   * 0.50 +
    quarters90 * 0.25 +
    dimes90    * 0.10;

  const aswPerDollar = use715.checked ? ASW_90_PER_DOLLAR_WORN : ASW_90_PER_DOLLAR_BU;
  const asw90 = fv90 * aswPerDollar;

  // ---- 40% halves ----
  const halves40 = parseIntSafe(h40.value);
  const fv40 = halves40 * 0.50;
  const asw40 = halves40 * ASW_40_HALF;

  // ---- Bullion silver ----
  const roundsCount = parseIntSafe(rounds.value);
  const aseCount = parseIntSafe(ase.value);
  const bullionOz = (roundsCount + aseCount) * 1.0;

  // ---- Other .999 silver oz ----
  const ozOther = parseNum(ozOtherSilver.value);

  // ---- Totals (silver) ----
  const totalAsw = asw90 + asw40 + bullionOz + ozOther;
  const silverMelt = totalAsw * sSpot;

  // ---- Gold pre-33 ----
  const c25 = parseIntSafe(g25.value);
  const c5  = parseIntSafe(g5.value);
  const c10 = parseIntSafe(g10.value);
  const c20 = parseIntSafe(g20.value);

  const agwPre33 =
    c25 * PRE33_AGW.g25 +
    c5  * PRE33_AGW.g5 +
    c10 * PRE33_AGW.g10 +
    c20 * PRE33_AGW.g20;

  // ---- Gold AGE ----
  const a10  = parseIntSafe(age10.value);
  const a25  = parseIntSafe(age25.value);
  const a50  = parseIntSafe(age50.value);
  const a100 = parseIntSafe(age100.value);

  const agwAge =
    a10  * AGE_AGW.age10 +
    a25  * AGE_AGW.age25 +
    a50  * AGE_AGW.age50 +
    a100 * AGE_AGW.age100;

  const totalAgw = agwPre33 + agwAge;
  const goldMelt = totalAgw * gSpot;

  // ---- Combined ----
  const totalMelt = silverMelt + goldMelt;
  const offer = totalMelt * (1 - dPct);

  // ---- Output ----
  const fvTotal = fv90 + fv40;
  outFV90.textContent = money(fv90);
  outFV40.textContent = money(fv40);
  outFVTotal.textContent = money(fvTotal);

  outBullionOz.textContent = fmt(bullionOz, 2);
  outAsw.textContent = fmt(totalAsw, 2);
  outSilverMelt.textContent = money(silverMelt);

  outAgw.textContent = fmt(totalAgw, 5);
  outGoldMelt.textContent = money(goldMelt);

  outTotal.textContent = money(totalMelt);
  outOffer.textContent = money(offer);

  if (sSpot === 0 && gSpot === 0) {
    status.textContent = "Tip: enter spot prices for instant melt/offers. Works offline after first load.";
  } else {
    status.textContent = "Ready.";
  }
}

// -------------------- Save/Load/Clear --------------------
const STORAGE_KEY = "lotScannerState_v3";

function save() {
  const data = {
    spotSilver: spotSilver.value,
    spotGold: spotGold.value,
    discount: discount.value,
    use715: use715.checked ? "1" : "0",

    h90: h90.value, q90: q90.value, d90: d90.value,
    h40: h40.value,
    ozOtherSilver: ozOtherSilver.value,
    rounds: rounds.value,
    ase: ase.value,

    g25: g25.value, g5: g5.value, g10: g10.value, g20: g20.value,
    age10: age10.value, age25: age25.value, age50: age50.value, age100: age100.value
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  status.textContent = "Saved to this iPhone.";
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { calc(); return; }

  try {
    const data = JSON.parse(raw);

    spotSilver.value = data.spotSilver || "";
    spotGold.value = data.spotGold || "";
    discount.value = data.discount || "0";
    use715.checked = (data.use715 ?? "1") === "1";

    h90.value = data.h90 ?? "";
    q90.value = data.q90 ?? "";
    d90.value = data.d90 ?? "";
    h40.value = data.h40 ?? "";
    ozOtherSilver.value = data.ozOtherSilver ?? "";
    rounds.value = data.rounds ?? "";
    ase.value = data.ase ?? "";

    g25.value = data.g25 ?? "";
    g5.value  = data.g5 ?? "";
    g10.value = data.g10 ?? "";
    g20.value = data.g20 ?? "";
    age10.value  = data.age10 ?? "";
    age25.value  = data.age25 ?? "";
    age50.value  = data.age50 ?? "";
    age100.value = data.age100 ?? "";
  } catch {
    // ignore parse errors; user can keep using app
  }

  calc();
}

function clearCounts() {
  // Clear only counts (leave spot + discount)
  [
    h90, q90, d90, h40,
    ozOtherSilver, rounds, ase,
    g25, g5, g10, g20,
    age10, age25, age50, age100
  ].forEach(x => x.value = "");

  status.textContent = "Cleared counts (spots/discount kept).";
  calc();
}

// -------------------- Events --------------------
recalcInputs.forEach(inp => {
  if (!inp) return;
  const evt = (inp === use715) ? "change" : "input";
  inp.addEventListener(evt, calc);
});

saveBtn.addEventListener("click", save);
clearBtn.addEventListener("click", clearCounts);

// iOS PWA focus helper (optional, harmless)
spotSilver.addEventListener("touchend", () => spotSilver.focus(), { passive:true });
spotGold.addEventListener("touchend", () => spotGold.focus(), { passive:true });

// Service worker (GitHub Pages safe: relative)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try { await navigator.serviceWorker.register("./sw.js"); }
    catch (e) { console.warn("SW failed:", e); }
  });
}

load();
