# Mops Test Assistant - V2 GPT-Powered Fixture Generator

This README documents the **V2 GPT-Powered Assistant** version of the Fixture Generator for the Mops Test Assistant. It showcases how AI can parse marketing copy and drive Cypress tests in an automated QA pipeline.

---

## Overview V2 System Flow(GPT-Powered, Headless Agent)

This v2-gpt-powered proof of concept demonstrates a local-first QA assistant workflow, built to simulate how a future Companion Agent like GoCass could be integrated with Testla to support MOps Editors and Site-QE:

V2 of the Test Assistant accepts marketing copy from a .docx file provided by the Copywriter/UX team as the source of truth.

The .docx file content is pasted directly into the browser console using a JavaScript fetch() template (simulating an agent’s behavior).

Note: Future iterations would include a hosted UI with GoCass agent integration, allowing editors to drag and drop .docx files and choose preferred LLMs.

The local Express server then calls the GPT API via openai.js to parse the copy into a structured JSON object with fields like headline, eyebrow, description, ctaText, and imageUrl.

The Node/Express backend receives the JSON and saves it to disk in the cypress/fixtures/ directory using the appropriate component name (e.g., full-width-marquee.json).

A MOps editor then runs Cypress end-to-end tests (located in cypress/e2e/) which load the saved fixture and verify that the live page (Netlify or staging URL) renders the expected content using data-cy selectors.

This approach simulates a headless GPT agent doing the heavy lifting behind the scenes — parsing, structuring, and persisting test data automatically, while the editor simply runs Cypress.

---

## Project Structure

```
/                (project root)
├── cypress/
│   ├── e2e/
│   │   ├── fullWidthMarquee.cy.js
│   │   ├── megaMarqueePOC.cy.js
│   │   └── dynamicTest.cy.js
│   ├── fixtures/
│   │   ├── full-width-marquee.json
│   │   └── mega-marquee.json
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── v2-gpt-powered/
│   ├── server/
│   │   ├── index.js               # Starts the local Express server
│   │   ├── routes/fixtures.js     # POST + GET fixture APIs (parsing & saving)
│   │   └── services/openai.js     # Calls GPT parsing logic
│   ├── cypress/support/          # V2 command extensions (optional)
│   └── docs/                     # Raw copydocs for testing
├── test-documents/              # Sample .docx inputs (failing/passing)
├── cypress.config.cjs
└── .env                         # Contains your OPENAI_API_KEY

Built with future Testla integration in mind. Sets the foundation for GoCass or similar AI-driven QA agents that assist in automating test coverage for high-velocity site changes.
```

---

## How to Use It – Step-by-Step

### 1. Start the Local Server

In your terminal:

```bash
node v2-gpt-powered/server/index.js
```

This starts the server at: [**http://localhost:3001/**](http://localhost:3001/)

Ensure your `.env` file is in place with:

```
OPENAI_API_KEY=your-key-here
```

---

### 2. Copy + Paste the GPT Prompt

Paste this prompt into ChatGPT (or an API tool):

```
You are a QA assistant. Given the following content from a marketing copy doc, extract the following fields in JSON format:
- headline
- eyebrow
- description
- ctaText
- ctaUrl
- imageUrl (if mentioned)

Only return a JSON object. Here's the content:
"""
Your pasted copy doc content goes here...
"""
```

> This will return the structured JSON for Cypress to use.

---

### 3. POST JSON to Server via Browser Console

Open DevTools Console on any webpage and paste:

```js
fetch("http://localhost:3001/api/generate-fixture", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    component: "full-width-marquee", // or "mega-marquee"
    text: `Your pasted Word doc content here...`,
  }),
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
```

You should get a response like:

```json
{
  "success": true,
  "message": "Fixture saved as mega-marquee.json",
  "data": { "headline": "..." }
}
```

---

### 4. Confirm Fixture Was Saved

Check your local folder:

```
v2-gpt-powered/fixtures/
├── mega-marquee.json
├── full-width-marquee.json
```

---

### 5. Use the Fixture in Cypress

Run Cypress Test Runner:

```bash
npx cypress open
```

Example test:

```js
describe("Marquee Component", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
    cy.viewport(1920, 1080);
  });

  it("Validates text from fixture", () => {
    cy.fixture("mega-marquee.json").then((fixture) => {
      cy.get('[data-cy="headline"]').should("contain.text", fixture.headline);
    });
  });
});
```

---

## What’s Next

- Self Hosted MVP using ChatGPT
- Local Agent POC inside Testla
- Drag-and-drop `.docx` upload
- Trigger Cypress automatically post-save
- Compare original copy vs. rendered site
- Secure hosting and GoCass integration

---

## 🧾 Summary

- GPT parses raw copy into structured JSON
- Express server saves that JSON locally
- Cypress tests pull from saved fixture
- This workflow mimics the internal Testla flow and sets the foundation for editor-powered QA

---

**Built for GoDaddy MOps QA Automation, V2.**

To run V2 server in terminal add command:

node v2-gpt-powered/server/index.js

Server location http://localhost:3001/
