const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- SQLite setup ---
const dbPath = path.join("/data", "scores.db");
const db = new sqlite3.Database(dbPath);

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blue_goalie TEXT NOT NULL,
  blue_attack TEXT NOT NULL,
  red_goalie TEXT NOT NULL,
  red_attack TEXT NOT NULL,
  blue_score INTEGER NOT NULL,
  red_score INTEGER NOT NULL
)`);

// --- Routes ---
app.get("/scores", (req, res) => {
  db.all("SELECT blue_goalie, blue_attack, red_goalie, red_attack, blue_score, red_score FROM scores", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Submit a score
app.post("/scores", (req, res) => {
  const { blue_goalie, blue_attack, red_goalie, red_attack, blue_score, red_score } = req.body;
  if (typeof blue_goalie !== "string" || typeof blue_attack !== "string" || typeof red_goalie !== "string" || typeof red_attack !== "string" || typeof blue_score !== "number" || typeof red_score !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }
  db.run("INSERT INTO scores (blue_goalie, blue_attack, red_goalie, red_attack, blue_score, red_score) VALUES (?, ?, ?, ?, ?, ?)", [blue_goalie, blue_attack, red_goalie, red_attack, blue_score, red_score], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
