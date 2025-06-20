// server/index.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const parseDoc = require("./scripts/parse-doc");

const app = express();
const PORT = 3000;

// Middleware to serve static files (HTML form)
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "server/uploads/",
  filename: (req, file, cb) => cb(null, "copydoc.docx"),
});
const upload = multer({ storage });

// POST /run-tests
app.post("/run-tests", upload.single("copydoc"), async (req, res) => {
  const draftUrl = req.body.draftUrl;
  const filePath = path.resolve(__dirname, "uploads", "copydoc.docx");

  try {
    // Step 1: Parse doc into fixture
    await parseDoc(filePath, draftUrl); // saves fixture/auto-fixture.json

    // Step 2: Run Cypress test
    exec(
      `npx cypress run --spec "server/cypress/e2e/dynamicTest.cy.js"`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("Cypress error:", stderr);
          return res.status(500).send("Test run failed.");
        }

        // Step 3: Read simplified test output (can be improved later)
        const resultPath = path.resolve(__dirname, "results", "result.json");
        const results = fs.existsSync(resultPath)
          ? JSON.parse(fs.readFileSync(resultPath))
          : { status: "Ran, but no result.json yet." };

        res.send(`
          <h1>Test Results</h1>
          <pre>${JSON.stringify(results, null, 2)}</pre>
          <a href="/">Run Another Test</a>
        `);
      }
    );
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
