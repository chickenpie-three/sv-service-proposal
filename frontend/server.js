import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname)); // serve index.html and assets

// Health check & fallback
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Frontend running on :${PORT}`));

