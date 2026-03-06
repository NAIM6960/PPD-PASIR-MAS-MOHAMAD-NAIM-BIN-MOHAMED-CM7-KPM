import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("scores.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rank TEXT,
    team TEXT,
    school TEXT,
    status TEXT,
    score TEXT,
    category TEXT
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM scores").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO scores (rank, team, school, status, score, category) VALUES (?, ?, ?, ?, ?, ?)");
  insert.run("01", "Cyber Knights", "SK Kota Bharu", "Selesai", "94.5", "rendah");
  insert.run("02", "Robo-Tech", "SK Pasir Mas", "Selesai", "91.2", "rendah");
  insert.run("03", "Micro-Bot Alpha", "SK Tanah Merah", "Selesai", "88.7", "rendah");
  insert.run("04", "Kelantan Innovators", "SK Machang", "Penilaian", "--", "rendah");
  insert.run("05", "Tech-Wizards", "SK Tumpat", "Menunggu", "--", "rendah");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  app.get("/api/scores", (req, res) => {
    try {
      const category = req.query.category || "rendah";
      const scores = db.prepare("SELECT * FROM scores WHERE category = ? ORDER BY score DESC, rank ASC").all(category);
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.post("/api/scores/update", (req, res) => {
    try {
      const { id, score, status } = req.body;
      db.prepare("UPDATE scores SET score = ?, status = ? WHERE id = ?").run(score, status, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Database update error" });
    }
  });

  const distPath = path.resolve(__dirname, "dist");
  const indexPath = path.resolve(distPath, "index.html");

  if (fs.existsSync(indexPath)) {
    // Production Mode: Serve static files from dist
    console.log("Serving from production build (dist)...");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.originalUrl.startsWith("/api")) return res.status(404).json({ error: "API not found" });
      res.sendFile(indexPath);
    });
  } else {
    // Development Mode: Use Vite middleware
    console.log("Dist not found, falling back to Vite dev mode...");
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: '0.0.0.0',
        port: 3000,
        hmr: false
      },
      appType: "spa",
    });
    
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        console.error(e);
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
