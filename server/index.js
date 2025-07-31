const express = require("express");
const path = require("path");
const multer = require("multer");
const parseDoc = require("./scripts/parse-doc");

const app = express();
const port = 3000;

// Setup multer to store uploaded .docx files
const upload = multer({ dest: path.join(__dirname, "uploads") });

// Serve the frontend form from /public
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// Route to handle form submission
app.post("/run-tests", upload.single("copydoc"), async (req, res) => {
  const uploadedDocPath = req.file.path;
  const draftUrl = req.body.draftUrl;

  console.log(`\nFile uploaded: ${uploadedDocPath}`);
  console.log(`Draft URL: ${draftUrl}`);

  try {
    await parseDoc(uploadedDocPath, draftUrl); // THIS triggers your updated moduleTestMap
    res.send(`
      <h2>Test fixture generated successfully.</h2>
      <p>You can now run Cypress tests.</p>
      <a href="/">Run Another Test</a>
    `);
  } catch (error) {
    console.error("Error during parsing:", error);
    res.status(500).send("Failed to parse the document.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
