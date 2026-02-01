const APP_VERSION = "v19";
document.getElementById("version").textContent = APP_VERSION;

// ---------------- Constants ----------------
const ASW_90_PER_DOLLAR_WORN = 0.7150;
const ASW_90_PER_DOLLAR_BU   = 0.7234;

const ASW_40_HALF = 0.1479;
const ASW_90_DOLLAR = 0.77344;
const ASW_40_IKE = 0.31610;

const PRE33_AGW = { g25:0.12094, g5:0.24187, g10:0.48375, g20:0.96750 };
const AGE_AGW   = { age10:0.10, age25:0.25, age50:0.50, age100:1.00 };

const CHANNEL_DEFAULTS = {
  wholesale: 70.0,
  refiner: 80.5,
  ebay: 85.0,
  public: 101.0
};

const el = (id) => document.getElementById(id);

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
function sellFromMelt(melt, sellPct){
  const p = (Number.isFinite(sellPct) ? sellPct : 0) / 100;
  return melt * p;
}
function setProfitClass(node, value){
  node.classList.remove("pos","neg");
  if (value >= 0) node.classList.add("pos");
  else node.classList.add("neg");
}
function fmtDate(ts){
  const d = new Date(ts);
  return new Intl.DateTimeFormat(undefined, {
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).format(d);
}
function escapeHtml(s){
  return (s || "").toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------------- Inputs ----------------
const spotSilver = el("spotSilver");
const spotGold   = el("spotGold");
const use715     = el("use715");
const lotName    = el("lotName");

const h90 = el("h90"), q90 = el("q90"), d90 = el("d90"), sd90 = el("sd90");
const disc90 = el("disc90"); const d90Label = el("d90Label");

const h40 = el("h40"), sd40 = el("sd40");
const disc40 = el("disc40"); const d40Label = el("d40Label");

const ozOtherSilver = el("ozOtherSilver");
const discOz = el("discOz"); const dOZLabel = el("dOZLabel");

const rounds = el("rounds");
const discRounds = el("discRounds"); const dRndLabel = el("dRndLabel");

const ase = el("ase");
const discAse = el("discAse"); const dAseLabel = el("dAseLabel");

const g25 = el("g25"), g5 = el("g5"), g10 = el("g10"), g20 = el("g20");
const age10 = el("age10"), age25 = el("age25"), age50 = el("age50"), age100 = el("age100");
const discGold = el("discGold"); const dGoldLabel = el("dGoldLabel");

// resale controls
const resale90 = el("resale90"), sellPct90 = el("sellPct90"), sellPct90Label = el("sellPct90Label");
const resale40 = el("resale40"), sellPct40 = el("sellPct40"), sellPct40Label = el("sellPct40Label");
const resaleOz = el("resaleOz"), sellPctOz = el("sellPctOz"), sellPctOzLabel = el("sellPctOzLabel");
const resaleRnd= el("resaleRnd"),sellPctRnd= el("sellPctRnd"),sellPctRndLabel= el("sellPctRndLabel");
const resaleAse= el("resaleAse"),sellPctAse= el("sellPctAse"),sellPctAseLabel= el("sellPctAseLabel");
const resaleGold=el("resaleGold"),sellPctGold=el("sellPctGold"),sellPctGoldLabel=el("sellPctGoldLabel");

// resale panels
const resale90Panel = el("resale90Panel");
const resale40Panel = el("resale40Panel");
const resaleOzPanel = el("resaleOzPanel");
const resaleRndPanel= el("resaleRndPanel");
const resaleAsePanel= el("resaleAsePanel");
const resaleGoldPanel=el("resaleGoldPanel");

// totals resale panel
const totalsResalePanel = el("totalsResalePanel");

// Buttons / status
const saveBtn = el("saveBtn");
const saveQuoteBtn = el("saveQuoteBtn");
const clearBtn = el("clearBtn");
const status = el("status");

// Quotes
const quotesList = el("quotesList");
const deleteAllQuotesBtn = el("deleteAllQuotesBtn");

// ---------------- Outputs ----------------
const outFV90 = el("outFV90");
const outD90  = el("outD90");
const outASW90FV = el("outASW90FV");
const outASW90D  = el("outASW90D");
const outMelt90  = el("outMelt90");
const outOffer90 = el("outOffer90");
const outSell90  = el("outSell90");
const outProfit90= el("outProfit90");

const outFV40 = el("outFV40");
const outD40  = el("outD40");
const outASW40H = el("outASW40H");
const outASW40D = el("outASW40D");
const outMelt40 = el("outMelt40");
const outOffer40= el("outOffer40");
const outSell40 = el("outSell40");
const outProfit40=el("outProfit40");

const outOzOther = el("outOzOther");
const outMeltOz  = el("outMeltOz");
const outOfferOz = el("outOfferOz");
const outSellOz  = el("outSellOz");
const outProfitOz= el("outProfitOz");

const outRndOz = el("outRndOz");
const outMeltRnd = el("outMeltRnd");
const outOfferRnd= el("outOfferRnd");
const outSellRnd = el("outSellRnd");
const outProfitRnd=el("outProfitRnd");

const outAseOz = el("outAseOz");
const outMeltAse = el("outMeltAse");
const outOfferAse= el("outOfferAse");
const outSellAse = el("outSellAse");
const outProfitAse=el("outProfitAse");

const outGoldOz = el("outGoldOz");
const outMeltGold = el("outMeltGold");
const outOfferGold= el("outOfferGold");
const outSellGold = el("outSellGold");
const outProfitGold=el("outProfitGold");

const outTotalMelt = el("outTotalMelt");
const outTotalOffer= el("outTotalOffer");
const outTotalSell = el("outTotalSell");
const outTotalProfit = el("outTotalProfit");

// ---------------- Behind-scenes toggles ----------------
const TOGGLE_KEY = "lotScannerResaleVisible_v8";

function getToggleState(){
  const raw = localStorage.getItem(TOGGLE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch { return {}; }
}
function setToggleState(obj){
  localStorage.setItem(TOGGLE_KEY, JSON.stringify(obj));
}

function setPanelVisible(panel, btn, visible){
  if (!panel) return;
  panel.classList.toggle("hidden", !visible);
  if (btn) btn.textContent = visible ? "Hide" : "Show";
}

const TOGGLE_MAP = {
  resale90: resale90Panel,
  resale40: resale40Panel,
  resaleOz: resaleOzPanel,
  resaleRnd: resaleRndPanel,
  resaleAse: resaleAsePanel,
  resaleGold: resaleGoldPanel,
  totalsResale: totalsResalePanel
};

function syncAllToggleButtons(){
  const state = getToggleState();
  document.querySelectorAll('button[data-toggle]').forEach(btn => {
    const key = btn.getAttribute("data-toggle");
    const panel = TOGGLE_MAP[key];
    const visible = !!state[key];
    setPanelVisible(panel, btn, visible);
  });
}

// Single delegated click handler (no double-binding)
document.addEventListener("click", (e) => {
  const btn = e.target.closest('button[data-toggle]');
  if (!btn) return;

  const key = btn.getAttribute("data-toggle");
  const panel = TOGGLE_MAP[key];
  if (!panel) return;

  const state = getToggleState();
  const next = !state[key];
  state[key] = next;
  setToggleState(state);
  setPanelVisible(panel, btn, next);
});

// ---------------- Channel behavior ----------------
function applyChannelDefault(selectEl, rangeEl, labelEl){
  const ch = selectEl.value;
  const def = CHANNEL_DEFAULTS[ch] ?? 98.0;
  rangeEl.value = String(def);
  labelEl.textContent = `${fmt(def, 1)}%`;
}
function updateSellLabel(rangeEl, labelEl){
  labelEl.textContent = `${fmt(parseNum(rangeEl.value), 1)}%`;
}

[
  [resale90, sellPct90, sellPct90Label],
  [resale40, sellPct40, sellPct40Label],
  [resaleOz, sellPctOz, sellPctOzLabel],
  [resaleRnd, sellPctRnd, sellPctRndLabel],
  [resaleAse, sellPctAse, sellPctAseLabel],
  [resaleGold, sellPctGold, sellPctGoldLabel],
].forEach(([sel, rng, lab]) => {
  sel.addEventListener("change", () => {
    applyChannelDefault(sel, rng, lab);
    calc();
  });
  rng.addEventListener("input", () => {
    updateSellLabel(rng, lab);
    calc();
  });
});

function updateDiscountLabels(){
  d90Label.textContent = `${parseNum(disc90.value)}%`;
  d40Label.textContent = `${parseNum(disc40.value)}%`;
  dOZLabel.textContent = `${parseNum(discOz.value)}%`;
  dRndLabel.textContent = `${parseNum(discRounds.value)}%`;
  dAseLabel.textContent = `${parseNum(discAse.value)}%`;
  dGoldLabel.textContent = `${parseNum(discGold.value)}%`;
}

// ---------------- Calc ----------------
function calc(){
  updateDiscountLabels();

  updateSellLabel(sellPct90, sellPct90Label);
  updateSellLabel(sellPct40, sellPct40Label);
  updateSellLabel(sellPctOz, sellPctOzLabel);
  updateSellLabel(sellPctRnd, sellPctRndLabel);
  updateSellLabel(sellPctAse, sellPctAseLabel);
  updateSellLabel(sellPctGold, sellPctGoldLabel);

  const sSpot = parseNum(spotSilver.value);
  const gSpot = parseNum(spotGold.value);

  // 90%
  const halves90  = parseIntSafe(h90.value);
  const quarters90= parseIntSafe(q90.value);
  const dimes90   = parseIntSafe(d90.value);
  const dollars90 = parseIntSafe(sd90.value);

  const fv90 = halves90*0.50 + quarters90*0.25 + dimes90*0.10;
  const aswPerDollar = use715.checked ? ASW_90_PER_DOLLAR_WORN : ASW_90_PER_DOLLAR_BU;
  const asw90fv = fv90 * aswPerDollar;
  const asw90d  = dollars90 * ASW_90_DOLLAR;
  const melt90 = (asw90fv + asw90d) * sSpot;
  const offer90 = offerFromMelt(melt90, parseNum(disc90.value));
  const sell90 = sellFromMelt(melt90, parseNum(sellPct90.value));
  const profit90 = sell90 - offer90;

  outFV90.textContent = money(fv90);
  outD90.textContent = `${dollars90}`;
  outASW90FV.textContent = fmt(asw90fv, 2);
  outASW90D.textContent  = fmt(asw90d, 2);
  outMelt90.textContent  = money(melt90);
  outOffer90.textContent = money(offer90);
  outSell90.textContent  = money(sell90);
  outProfit90.textContent= money(profit90);
  setProfitClass(outProfit90, profit90);

  // 40%
  const halves40 = parseIntSafe(h40.value);
  const dollars40= parseIntSafe(sd40.value);

  const fv40 = halves40 * 0.50;
  const asw40h = halves40 * ASW_40_HALF;
  const asw40d = dollars40 * ASW_40_IKE;
  const melt40 = (asw40h + asw40d) * sSpot;
  const offer40= offerFromMelt(melt40, parseNum(disc40.value));
  const sell40 = sellFromMelt(melt40, parseNum(sellPct40.value));
  const profit40 = sell40 - offer40;

  outFV40.textContent = money(fv40);
  outD40.textContent  = `${dollars40}`;
  outASW40H.textContent = fmt(asw40h, 2);
  outASW40D.textContent = fmt(asw40d, 2);
  outMelt40.textContent = money(melt40);
  outOffer40.textContent= money(offer40);
  outSell40.textContent  = money(sell40);
  outProfit40.textContent= money(profit40);
  setProfitClass(outProfit40, profit40);

  // other .999 oz
  const ozOther = parseNum(ozOtherSilver.value);
  const meltOz = ozOther * sSpot;
  const offerOz= offerFromMelt(meltOz, parseNum(discOz.value));
  const sellOz = sellFromMelt(meltOz, parseNum(sellPctOz.value));
  const profitOz = sellOz - offerOz;

  outOzOther.textContent = fmt(ozOther, 2);
  outMeltOz.textContent  = money(meltOz);
  outOfferOz.textContent = money(offerOz);
  outSellOz.textContent  = money(sellOz);
  outProfitOz.textContent= money(profitOz);
  setProfitClass(outProfitOz, profitOz);

  // rounds
  const roundsCount = parseIntSafe(rounds.value);
  const rndOz = roundsCount * 1.0;
  const meltRnd = rndOz * sSpot;
  const offerRnd= offerFromMelt(meltRnd, parseNum(discRounds.value));
  const sellRnd = sellFromMelt(meltRnd, parseNum(sellPctRnd.value));
  const profitRnd = sellRnd - offerRnd;

  outRndOz.textContent = fmt(rndOz, 2);
  outMeltRnd.textContent  = money(meltRnd);
  outOfferRnd.textContent = money(offerRnd);
  outSellRnd.textContent  = money(sellRnd);
  outProfitRnd.textContent= money(profitRnd);
  setProfitClass(outProfitRnd, profitRnd);

  // ASE
  const aseCount = parseIntSafe(ase.value);
  const aseOz = aseCount * 1.0;
  const meltAse = aseOz * sSpot;
  const offerAse= offerFromMelt(meltAse, parseNum(discAse.value));
  const sellAse = sellFromMelt(meltAse, parseNum(sellPctAse.value));
  const profitAse = sellAse - offerAse;

  outAseOz.textContent = fmt(aseOz, 2);
  outMeltAse.textContent  = money(meltAse);
  outOfferAse.textContent = money(offerAse);
  outSellAse.textContent  = money(sellAse);
  outProfitAse.textContent= money(profitAse);
  setProfitClass(outProfitAse, profitAse);

  // Gold
  const c25 = parseIntSafe(g25.value);
  const c5  = parseIntSafe(g5.value);
  const c10 = parseIntSafe(g10.value);
  const c20 = parseIntSafe(g20.value);

  const a10  = parseIntSafe(age10.value);
  const a25  = parseIntSafe(age25.value);
  const a50  = parseIntSafe(age50.value);
  const a100 = parseIntSafe(age100.value);

  const goldOz =
    c25*PRE33_AGW.g25 + c5*PRE33_AGW.g5 + c10*PRE33_AGW.g10 + c20*PRE33_AGW.g20 +
    a10*AGE_AGW.age10 + a25*AGE_AGW.age25 + a50*AGE_AGW.age50 + a100*AGE_AGW.age100;

  const meltGold = goldOz * gSpot;
  const offerGold= offerFromMelt(meltGold, parseNum(discGold.value));
  const sellGold = sellFromMelt(meltGold, parseNum(sellPctGold.value));
  const profitGold = sellGold - offerGold;

  outGoldOz.textContent = fmt(goldOz, 5);
  outMeltGold.textContent = money(meltGold);
  outOfferGold.textContent= money(offerGold);
  outSellGold.textContent  = money(sellGold);
  outProfitGold.textContent= money(profitGold);
  setProfitClass(outProfitGold, profitGold);

  // totals
  const totalMelt = melt90 + melt40 + meltOz + meltRnd + meltAse + meltGold;
  const totalOffer = offer90 + offer40 + offerOz + offerRnd + offerAse + offerGold;
  const totalSell  = sell90 + sell40 + sellOz + sellRnd + sellAse + sellGold;
  const totalProfit = totalSell - totalOffer;

  outTotalMelt.textContent = money(totalMelt);
  outTotalOffer.textContent= money(totalOffer);
  outTotalSell.textContent = money(totalSell);
  outTotalProfit.textContent = money(totalProfit);
  setProfitClass(outTotalProfit, totalProfit);

  window.__lastTotals = { totalMelt, totalOffer, totalSell, totalProfit };

  status.textContent = (sSpot === 0 && gSpot === 0)
    ? "Enter spot prices. Behind-scenes panels are hidden by default."
    : "Ready.";
}

// ---------------- State + Quotes ----------------
const STATE_KEY = "lotScannerState_v8";
const QUOTES_KEY = "lotScannerQuotes_v8";

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

    disc90: disc90.value, disc40: disc40.value, discOz: discOz.value,
    discRounds: discRounds.value, discAse: discAse.value, discGold: discGold.value,

    resale90: resale90.value, sellPct90: sellPct90.value,
    resale40: resale40.value, sellPct40: sellPct40.value,
    resaleOz: resaleOz.value, sellPctOz: sellPctOz.value,
    resaleRnd: resaleRnd.value, sellPctRnd: sellPctRnd.value,
    resaleAse: resaleAse.value, sellPctAse: sellPctAse.value,
    resaleGold: resaleGold.value, sellPctGold: sellPctGold.value,

    resaleVisible: getToggleState()
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

  resale90.value = s.resale90 ?? "wholesale";
  sellPct90.value = s.sellPct90 ?? String(CHANNEL_DEFAULTS[resale90.value]);
  resale40.value = s.resale40 ?? "wholesale";
  sellPct40.value = s.sellPct40 ?? String(CHANNEL_DEFAULTS[resale40.value]);
  resaleOz.value = s.resaleOz ?? "refiner";
  sellPctOz.value = s.sellPctOz ?? String(CHANNEL_DEFAULTS[resaleOz.value]);
  resaleRnd.value = s.resaleRnd ?? "wholesale";
  sellPctRnd.value = s.sellPctRnd ?? String(CHANNEL_DEFAULTS[resaleRnd.value]);
  resaleAse.value = s.resaleAse ?? "wholesale";
  sellPctAse.value = s.sellPctAse ?? String(CHANNEL_DEFAULTS[resaleAse.value]);
  resaleGold.value = s.resaleGold ?? "refiner";
  sellPctGold.value = s.sellPctGold ?? String(CHANNEL_DEFAULTS[resaleGold.value]);

  if (s.resaleVisible && typeof s.resaleVisible === "object") {
    setToggleState(s.resaleVisible);
  }
}

function saveState(){
  localStorage.setItem(STATE_KEY, JSON.stringify(getStateSnapshot()));
  status.textContent = "Saved to this iPhone.";
}

function loadState(){
  const raw = localStorage.getItem(STATE_KEY);
  if (raw) { try { applyStateSnapshot(JSON.parse(raw)); } catch {} }
}

function clearCounts(){
  [h90,q90,d90,sd90,h40,sd40,ozOtherSilver,rounds,ase,g25,g5,g10,g20,age10,age25,age50,age100]
    .forEach(x => x.value = "");
  status.textContent = "Cleared counts (spots + sliders kept).";
  calc();
}

// Quotes
function getQuotes(){
  const raw = localStorage.getItem(QUOTES_KEY);
  if (!raw) return [];
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; }
  catch { return []; }
}
function setQuotes(arr){ localStorage.setItem(QUOTES_KEY, JSON.stringify(arr.slice(0,25))); }

function saveQuote(){
  calc();
  const totals = window.__lastTotals || { totalMelt:0, totalOffer:0, totalSell:0, totalProfit:0 };
  const snapshot = getStateSnapshot();

  const quote = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    name: (snapshot.lotName || "").trim(),
    totalOffer: totals.totalOffer,
    totalMelt: totals.totalMelt,
    totalSell: totals.totalSell,
    totalProfit: totals.totalProfit,
    snapshot
  };

  const quotes = getQuotes();
  quotes.unshift(quote);
  setQuotes(quotes);

  status.textContent = "Quote saved.";
  renderQuotes();
}

function deleteQuote(id){
  setQuotes(getQuotes().filter(q => q.id !== id));
  renderQuotes();
}
function deleteAllQuotes(){
  localStorage.removeItem(QUOTES_KEY);
  renderQuotes();
  status.textContent = "All quotes deleted.";
}
function loadQuote(id){
  const q = getQuotes().find(x => x.id === id);
  if (!q) return;
  applyStateSnapshot(q.snapshot);

  // after restoring toggle state, re-sync button text + panels
  syncAllToggleButtons();

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
    const sub = `${fmtDate(q.ts)} • Offer ${money(q.totalOffer)} • Profit ${money(q.totalProfit)}`;
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

quotesList.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn && btn.dataset && btn.dataset.action) {
    const id = btn.dataset.id;
    if (btn.dataset.action === "load") loadQuote(id);
    if (btn.dataset.action === "del") deleteQuote(id);
    return;
  }
  const item = e.target.closest(".quoteItem");
  if (item && item.dataset && item.dataset.id) loadQuote(item.dataset.id);
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

// iOS focus helper
spotSilver.addEventListener("touchend", () => spotSilver.focus(), { passive:true });
spotGold.addEventListener("touchend", () => spotGold.focus(), { passive:true });

// Buttons
saveBtn.addEventListener("click", () => { saveState(); });
saveQuoteBtn.addEventListener("click", saveQuote);
clearBtn.addEventListener("click", clearCounts);

// Service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try { await navigator.serviceWorker.register("./sw.js"); }
    catch (e) { console.warn("SW failed:", e); }
  });
}

// Init
loadState();
syncAllToggleButtons();
renderQuotes();
calc();



