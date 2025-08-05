// create fixture endpoint
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseWithGPT } from "../services/openai.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/generate-fixture
router.post("/generate-fixture", async (req, res) => {
  try {
    const { text, component = "mega-marquee" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // confirm the request text
    console.log("Received raw text:", text);

    // Call GPT with the raw Word doc content
    const jsonFixture = await parseWithGPT(text);

    // confirm what GPT returned
    console.log("GPT returned:", jsonFixture);

    // Build dynamic fixture path
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "cypress",
      "fixtures",
      `${component}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(jsonFixture, null, 2), "utf-8");

    res.json({
      success: true,
      message: `Fixture saved as ${component}.json`,
      data: jsonFixture,
    });
  } catch (err) {
    console.error("Error generating fixture:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/fixtures/mega-marquee
router.get("/fixtures/mega-marquee", (req, res) => {
  const filePath = path.join(__dirname, "..", "fixtures", "mega-marquee.json");

  try {
    const fixtureData = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(fixtureData));
  } catch (err) {
    console.error("Error reading fixture:", err);
    res.status(500).json({ error: "Failed to read fixture file" });
  }
});

// GET /api/fixtures/full-width-marquee
router.get("/fixtures/full-width-marquee", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "fixtures",
    "full-width-marquee.json"
  );

  try {
    const fixtureData = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(fixtureData));
  } catch (err) {
    console.error("Error reading fixture:", err);
    res.status(500).json({ error: "Failed to read fixture file" });
  }
});

export default router;
