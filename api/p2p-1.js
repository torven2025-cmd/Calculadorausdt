module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const q = {
    asset: "USDT", fiat: "VES", tradeType: b.tradeType === "SELL" ? "SELL" : "BUY",
    page: 1, rows: 5,
    payTypes: Array.isArray(b.payTypes) ? b.payTypes : [],
    publisherType: b.publisherType === "merchant" ? "merchant" : null,
    countries: []
  };
  if (b.transAmount) q.transAmount = String(b.transAmount);
  const r = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "Origin": "https://p2p.binance.com",
      "Referer": "https://p2p.binance.com/es/trade/all-payments/USDT?fiat=VES",
      "clienttype": "web",
      "lang": "es",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    },
    body: JSON.stringify(q)
  });
  const t = await r.text();
  res.status(r.status).setHeader("Content-Type", "application/json").send(t);
};
