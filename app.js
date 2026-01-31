const APP_VERSION = "v8";
document.getElementById("version").textContent = APP_VERSION;

// ---------------- Constants ----------------
const ASW_90_PER_DOLLAR_WORN = 0.7150;
const ASW_90_PER_DOLLAR_BU   = 0.7234;

const ASW_40_HALF = 0.1479;
const ASW_90_DOLLAR = 0.77344;
const ASW_40_IKE = 0.31610;

const PRE33_AGW = { g25:0.12094, g5:0.24187, g10:0.48375, g20:0.96750 };
const AGE_AGW   = { age10:0.10, age25:0.25, age50:0.50, age100:1.00 };

// ---------------- DOM helpers ----------------
const el = (id) => document.getElementById(id);

// Top inputs
const spotSilver = el("spotSilver");
const spotGold   = el("spotGold");
const use715     = el("use715");
const lotName    = el("lotName");

// 90% inputs + slider + label
const h90 = el("h90"), q90 = el("q90"), d90 = el("d90"), sd90 = el("sd90");
const disc90 = el("disc90"); const d90Label = el("d90Label");

// 40% inputs + slider + label
const h40 = el("h40"), sd40 = el("sd40");
const disc40 = el("disc40"); const d40Label = el("d40Label");

// .999 oz
const ozOtherSilver = el("ozOtherSilver");
const discOz = el("discOz"); const dOZLabel = el("dOZLabel");

// rounds
const rounds = el("rounds");
const discRounds = el("discRounds"); const dRndLabel = el("dRndLabel");

// ASE
const ase = el("ase");
const discAse = el("discAse"); const dAseLabel = el("dAseLabel");

// gold
const g25 = el("g25"), g5 = el("g5"), g10 = el("g10"), g20 = el("g20");
const age10 = el("age10"), age25 = el("age25"), age50 = el("age50"), age100 = el("age100");
const discGold = el("discGold"); const dGoldLabel = el("dGoldLabel");

// Buttons / status
const saveBtn = el("saveBtn");
const saveQuoteBtn = el("saveQuoteBtn");
const clearBtn = el("clearBtn");
const status = el("status");

// Quotes UI
const quotesList = el("quotesList");
const deleteAllQuotesBtn = el("deleteAllQuotesBtn");

// Outputs 90%
const outFV90 = el("outFV90");
const outD90  = el("outD90");
const outASW90FV = el("outASW90FV");
const outASW90D  = el("outASW90D");
const outMelt90  = el("outMelt90");
const outOffer90 = el("outOffer90");

// Outputs 40%
const outFV40 = el("outFV40");
const outD40  = el("outD40");
const outASW40H = el("outASW40H");
const outASW40D = el("outASW40D");
const outMelt40 = el("outMelt40");
const outOffer40= el("outOffer40");

// Outputs oz other
const outOzOther = el("outOzOther");
const outMeltOz  = el("outMeltOz");
const outOfferOz = el("outOfferOz");

// Outputs rounds
const outRndOz = el("outRndOz");
const outMeltRnd = el("outMeltRnd");
const outOfferRnd= el("outOfferRnd");

// Outputs ASE
const outAseOz = el("outAseOz");
const outMeltAse = el("outMeltAse");
const outOfferAse= el("outOfferAse");

// Outputs gold
const outGoldOz = el("outGoldOz");
const outMeltGold = el("outMeltGold");
const outOfferGold= el("outOfferGold");

// Totals
const outTotalMelt = el("outTotalMelt");
const outTotalOffer= el("outTotalOffer");

// ---------------- Parsing/formatting ----------------
function parseNum(v){
  const raw = (v || "").toString().replace(/[$,\s]/g, "").trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}
function parseIntSafe(v){
  const raw = (v || "").toString().replace(/[^\d-]/g, "").trim();
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}
function money(n){
  return (Number.isFinite(n) ? n : 0).toLocaleString(undefined, { style:"currency", currency:"USD" });
}
function fmt(n, digits=2){
  return (Number.isFinite(n) ? n : 0).toFixed(digits);
}
function offerFromMelt(melt, discPct){
  const d = (Number.isFinite(discPct) ? discPct : 0) / 100;
  return melt * (1 - d);
}
function fmtDate(ts){
  const d = new Date(ts);
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).format(d);
}

// ---------------- Label updates ----------------
function updateLabels(){
  d90Label.textContent = `${parseNum(disc90.value)}%`;
  d40Label.textContent = `${parseNum(disc40.value)}%`;
  dOZLabel.textContent = `${parseNum(discOz.value)}%`;
  dRndLabel.textContent = `${parseNum(discRounds.value)}%`;
  dAseLabel.textContent = `${parseNum(discAse.value)}%`;
  dGoldLabel.textContent = `${parseNum(discGold.value)}%`;
}

// ---------------- State snapshot ----------------
function getStateSnapshot(){
  return {
    spotSilver: spotSilver.value,
    spotGold: spotGold.value,
    use715: use715.checked ? "1" : "0",
    lotName: lotName.value,

    h90: h90.value, q90: q90.value, d90: d90.value, sd90: sd90.value,
    h40: h40.value, sd40: sd40.value,

    ozOtherSilver: ozOtherSilver.value,
    rounds: rounds.value,
    ase: ase.value,

    g25: g25.value, g5: g5.value, g10: g10.value, g20: g20.value,
    age10: age10.value, age25: age25.value, age50: age50.value, age100: age100.value,

    disc90: disc90.value,
    disc40: disc40.value,
    discOz: discOz.value,
    discRounds: discRounds.value,
    discAse: discAse.value,
    discGold: discGold.value
  };
}

function applyStateSnapshot(s){
  spotSilver.value = s.spotSilver || "";
  spotGold.value   = s.spotGold || "";
  use715.checked   = (s.use715 ?? "1") === "1";
  lotName.value    = s.lotName || "";

  h90.value = s.h90 ?? ""; q90.value = s.q90 ?? ""; d90.value = s.d90 ?? ""; sd90.value = s.sd90 ?? "";
  h40.value = s.h40 ?? ""; sd40.value = s.sd40 ?? "";

  ozOtherSilver.value = s.ozOtherSilver ?? "";
  rounds.value = s.rounds ?? "";
  ase.value = s.ase ?? "";

  g25.value = s.g25 ?? ""; g5.value = s.g5 ?? ""; g10.value = s.g10 ?? ""; g20.value = s.g20 ?? "";
  age10.value = s.age10 ?? ""; age25.value = s.age25 ?? ""; age50.value = s.age50 ?? ""; age100.value = s.age100 ?? "";

  disc90.value = s.disc90 ?? "0";
  disc40.value = s.disc40 ?? "0";
  discOz.value = s.discOz ?? "0";
  discRounds.value = s.discRounds ?? "0";
  discAse.value = s.discAse ?? "0";
  discGold.value = s.discGold ?? "0";
}

// ---------------- Core calc ----------------
function calc(){
  updateLabels();

  const sSpot = parseNum(spotSilver.value);
  const gSpot = parseNum(spotGold.value);

  // ===== 90% bucket =====
  const halves90  = parseIntSafe(h90.value);
  const quarters90= parseIntSafe(q90.value);
  const dimes90   = parseIntSafe(d90.value);
  const dollars90 = parseIntSafe(sd90.value);

  const fv90 =
    halves90   * 0.50 +
    quarters90 * 0.25 +
    dimes90    * 0.10;

  const aswPerDollar = use715.checked ? ASW_90_PER_DOLLAR_WORN : ASW_90_PER_DOLLAR_BU;
  const asw90fv = fv90 * aswPerDollar;
  const asw90d  = dollars90 * ASW_90_DOLLAR;

  const asw90Total = asw90fv + asw90d;
  const melt90 = asw90Total * sSpot;
  const offer90 = offerFromMelt(melt90, parseNum(disc90.value));

  outFV90.textContent = money(fv90);
  outD90.textContent = `${dollars90}`;
  outASW90FV.textContent = fmt(asw90fv, 2);
  outASW90D.textContent  = fmt(asw90d, 2);
  outMelt90.textContent  = money(melt90);
  outOffer90.textContent = money(offer90);

  // ===== 40% bucket =====
  const halves40 = parseIntSafe(h40.value);
  const dollars40= parseIntSafe(sd40.value);

  const fv40 = halves40 * 0.50;
  const asw40h = halves40 * ASW_40_HALF;
  const asw40d = dollars40 * ASW_40_IKE;

  const asw40Total = asw40h + asw40d;
  const melt40 = asw40Total * sSpot;
  const offer40= offerFromMelt(melt40, parseNum(disc40.value));

  outFV40.textContent = money(fv40);
  outD40.textContent  = `${dollars40}`;
  outASW40H.textContent = fmt(asw40h, 2);
  outASW40D.textContent = fmt(asw40d, 2);
  outMelt40.textContent = money(melt40);
  outOffer40.textContent= money(offer40);

  // ===== Other .999 oz bucket =====
  const ozOther = parseNum(ozOtherSilver.value);
  const meltOz = ozOther * sSpot;
  const offerOz= offerFromMelt(meltOz, parseNum(discOz.value));

  outOzOther.textContent = fmt(ozOther, 2);
  outMeltOz.textContent  = money(meltOz);
  outOfferOz.textContent = money(offerOz);

  // ===== Rounds bucket =====
  const roundsCount = parseIntSafe(rounds.value);
  const rndOz = roundsCount * 1.0;
  const meltRnd = rndOz * sSpot;
  const offerRnd= offerFromMelt(meltRnd, parseNum(discRounds.value));

  outRndOz.textContent = fmt(rndOz, 2);
  outMeltRnd.textContent  = money(meltRnd);
  outOfferRnd.textContent = money(offerRnd);

  // ===== ASE bucket =====
  const aseCount = parseIntSafe(ase.value);
  const aseOz = aseCount * 1.0;
  const meltAse = aseOz * sSpot;
  const offerAse= offerFromMelt(meltAse, parseNum(discAse.value));

  outAseOz.textContent = fmt(aseOz, 2);
  outMeltAse.textContent  = money(meltAse);
  outOfferAse.textContent = money(offerAse);

  // ===== Gold bucket =====
  const c25 = parseIntSafe(g25.value);
  const c5  = parseIntSafe(g5.value);
  const c10 = parseIntSafe(g10.value);
  const c20 = parseIntSafe(g20.value);

  const a10  = parseIntSafe(age10.value);
  const a25  = parseIntSafe(age25.value);
  const a50  = parseIntSafe(age50.value);
  const a100 = parseIntSafe(age100.value);

  const agwPre33 =
    c25 * PRE33_AGW.g25 +
    c5  * PRE33_AGW.g5 +
    c10 * PRE33_AGW.g10 +
    c20 * PRE33_AGW.g20;

  const agwAge =
    a10  * AGE_AGW.age10 +
    a25  * AGE_AGW.age25 +
    a50  * AGE_AGW.age50 +
    a100 * AGE_AGW.age100;

  const goldOz = agwPre33 + agwAge;
  const meltGold = goldOz * gSpot;
  const offerGold= offerFromMelt(meltGold, parseNum(discGold.value));

  outGoldOz.textContent = fmt(goldOz, 5);
  outMeltGold.textContent = money(meltGold);
  outOfferGold.textContent= money(offerGold);

  // ===== Grand totals =====
  const totalMelt = melt90 + melt40 + meltOz + meltRnd + meltAse + meltGold;
  const totalOffer = offer90 + offer40 + offerOz + offerRnd + offerAse + offerGold;

  outTotalMelt.textContent = money(totalMelt);
  outTotalOffer.textContent= money(totalOffer);

  // Store last totals for quote saves (no DOM scraping)
  window.__lastTotals = { totalMelt, totalOffer };

  if (sSpot === 0 && gSpot === 0) status.textContent = "Enter spot prices. Per-bucket discounts let you quote faster.";
  else status.textContent = "Ready.";
}

// ---------------- Calculator state save/load/clear ----------------
const STATE_KEY = "lotScannerState_v6";

function saveState(){
  localStorage.setItem(STATE_KEY, JSON.stringify(getStateSnapshot()));
  status.textContent = "Saved to this iPhone.";
}

function loadState(){
  const raw = localStorage.getItem(STATE_KEY);
  if (raw) {
    try { applyStateSnapshot(JSON.parse(raw)); } catch {}
  }
  calc();
}

function clearCounts(){
  [
    h90,q90,d90,sd90,
    h40,sd40,
    ozOtherSilver, rounds, ase,
    g25,g5,g10,g20,
    age10,age25,age50,age100
  ].forEach(x => x.value = "");
  status.textContent = "Cleared counts (spots + discounts kept).";
  calc();
}

// ---------------- Quotes: Save/list/load/delete ----------------
const QUOTES_KEY = "lotScannerQuotes_v6";

function getQuotes(){
  const raw = localStorage.getItem(QUOTES_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setQuotes(arr){
  localStorage.setItem(QUOTES_KEY, JSON.stringify(arr.slice(0, 25)));
}

function saveQuote(){
  // Ensure totals are current
  calc();

  const totals = window.__lastTotals || { totalMelt: 0, totalOffer: 0 };
  const snapshot = getStateSnapshot();

  const quote = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    name: (snapshot.lotName || "").trim(),
    totalOffer: totals.totalOffer,
    totalMelt: totals.totalMelt,
    snapshot
  };

  const quotes = getQuotes();
  quotes.unshift(quote);
  setQuotes(quotes);

  status.textContent = "Quote saved.";
  renderQuotes();
}

function deleteQuote(id){
  const quotes = getQuotes().filter(q => q.id !== id);
  setQuotes(quotes);
  renderQuotes();
}

function deleteAllQuotes(){
  localStorage.removeItem(QUOTES_KEY);
  renderQuotes();
  status.textContent = "All quotes deleted.";
}

function loadQuote(id){
  const quotes = getQuotes();
  const q = quotes.find(x => x.id === id);
  if (!q) return;

  applyStateSnapshot(q.snapshot);
  calc();

  status.textContent = `Loaded quote: ${q.name ? q.name : fmtDate(q.ts)}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuotes(){
  const quotes = getQuotes();
  if (quotes.length === 0) {
    quotesList.innerHTML = `<div class="muted small">No quotes saved yet.</div>`;
    return;
  }

  quotesList.innerHTML = quotes.map(q => {
    const title = q.name ? q.name : "Untitled lot";
    const sub = `${fmtDate(q.ts)} • Offer ${money(q.totalOffer)} • Melt ${money(q.totalMelt)}`;

    return `
      <div class="quoteItem" data-id="${q.id}">
        <div class="quoteMeta">
          <div class="quoteTitle">${escapeHtml(title)}</div>
          <div class="quoteSub">${escapeHtml(sub)}</div>
        </div>
        <div class="quoteActions">
          <button type="button" data-action="load" data-id="${q.id}">Load</button>
          <button type="button" class="ghost" data-action="del" data-id="${q.id}">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

// Simple HTML escape for user-provided lot names
function escapeHtml(s){
  return (s || "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Quotes click handling (tap row to load; buttons override)
quotesList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn && btn.dataset && btn.dataset.action) {
    const id = btn.dataset.id;
    if (btn.dataset.action === "load") loadQuote(id);
    if (btn.dataset.action === "del") deleteQuote(id);
    return;
  }
  const item = e.target.closest(".quoteItem");
  if (item && item.dataset && item.dataset.id) {
    loadQuote(item.dataset.id);
  }
});

deleteAllQuotesBtn.addEventListener("click", deleteAllQuotes);

// ---------------- Events ----------------
[
  spotSilver, spotGold, use715, lotName,
  h90, q90, d90, sd90,
  h40, sd40,
  ozOtherSilver, rounds, ase,
  g25, g5, g10, g20,
  age10, age25, age50, age100,
  disc90, disc40, discOz, discRounds, discAse, discGold
].forEach(inp => {
  if (!inp) return;
  const evt = (inp === use715) ? "change" : "input";
  inp.addEventListener(evt, calc);
});

// iOS PWA focus helper
spotSilver.addEventListener("touchend", () => spotSilver.focus(), { passive:true });
spotGold.addEventListener("touchend", () => spotGold.focus(), { passive:true });

saveBtn.addEventListener("click", saveState);
saveQuoteBtn.addEventListener("click", saveQuote);
clearBtn.addEventListener("click", clearCounts);

// Service worker register (GitHub Pages safe)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try { await navigator.serviceWorker.register("./sw.js"); }
    catch (e) { console.warn("SW failed:", e); }
  });
}

// Init
loadState();
renderQuotes();

