import express from "express";
import session from "express-session";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// ✅ Pass defaultData here
const adapter = new JSONFileSync("./data/db.json");
const defaultData = { trades: [], users: [] };

const db = new LowSync(adapter, defaultData); // 👈 THIS is the fix
db.read();
db.write(); // optional — will save the default schema if file was empty

const app = express();
app.use(
  session({
    secret: "barter_hub_secret", // Change this in production
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Get current user from session
app.get("/api/me", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ username: req.session.user });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});
db.write(); // optional — will save the default schema if file was empty

function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: "Unauthorized" });
}

app.get("/api/trades", requireAuth, (req, res) => {
  db.read();
  res.json(db.data.trades);
});

app.post("/api/trades", requireAuth, (req, res) => {
  const { have, want, image } = req.body;
  if (!have || !want) return res.status(400).json({ error: "Missing fields" });

  db.read();
  const trade = {
    have,
    want,
    image,
    owner: req.session.user,
    bids: [],
    timestamp: new Date().toISOString(),
  };
  db.data.trades.push(trade);
  db.write();
  res.json({ success: true });
});

// Place a bid on a trade
app.post("/api/trades/:index/bid", requireAuth, (req, res) => {
  const { message } = req.body;
  const bidder = req.session.user;
  const index = parseInt(req.params.index, 10);
  db.read();
  const trade = db.data.trades[index];
  if (!trade) return res.status(404).json({ error: "Trade not found" });
  // Remove restriction: allow bidding on own trade
  if (!trade.bids) trade.bids = [];
  // Only allow one pending bid per user per trade
  if (trade.bids.some((b) => b.bidder === bidder && b.status === "pending")) {
    return res
      .status(409)
      .json({ error: "You already have a pending bid on this trade." });
  }
  trade.bids.push({ bidder, message, status: "pending" });
  db.write();
  res.json({ success: true });
});

// Accept or reject a bid
app.post("/api/trades/:index/bid/:bidIndex", requireAuth, (req, res) => {
  const { action } = req.body; // 'accept' or 'reject'
  const username = req.session.user;
  const index = parseInt(req.params.index, 10);
  const bidIndex = parseInt(req.params.bidIndex, 10);
  db.read();
  const trade = db.data.trades[index];
  if (!trade) return res.status(404).json({ error: "Trade not found" });
  if (trade.owner !== username)
    return res.status(403).json({ error: "Not your trade" });
  if (!trade.bids || !trade.bids[bidIndex])
    return res.status(404).json({ error: "Bid not found" });
  if (action === "accept") {
    // Accept this bid, reject all other pending bids
    trade.bids.forEach((b, i) => {
      if (i === bidIndex) {
        b.status = "accepted";
      } else if (b.status === "pending") {
        b.status = "rejected";
      }
    });
    db.write();
    return res.json({ success: true });
  } else if (action === "reject") {
    trade.bids[bidIndex].status = "rejected";
    db.write();
    return res.json({ success: true });
  }
  res.status(400).json({ error: "Invalid action" });
});

// Registration endpoint
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  db.read();
  // Ensure users array exists and is an array
  if (!Array.isArray(db.data.users)) db.data.users = [];
  if (db.data.users.find((u) => u.username === username)) {
    return res.status(409).json({ error: "Username already exists" });
  }
  db.data.users.push({ username, password });
  db.write();
  // Double-check: persist to file
  try {
    fs.writeFileSync(
      path.join(__dirname, "data", "db.json"),
      JSON.stringify(db.data, null, 2)
    );
  } catch (e) {
    // ignore, lowdb should handle it
  }
  res.json({ success: true });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.read();
  // Ensure users array exists
  if (!db.data.users) db.data.users = [];
  const user = db.data.users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});


app.listen(3000, () => console.log("✅ Running at http://localhost:3000"));
