# MOPS Test Assistant

The MOPS Test Assistant is a QA automation tool that parses `.docx` files (copy docks) and dynamically generates Cypress tests. It validates content accuracy on a target URL by matching against the parsed doc content.

## Overview

- Upload a `.docx` copy document via the local Node server.
- Enter the URL of the page you want to test (e.g., staging or production).
- Cypress dynamically generates and runs tests based on the parsed document.
- Visual pass/fail feedback is provided.

> **Live Test URL (Sho-Daddy Demo):**  
> [https://dazzling-kelpie-426d25.netlify.app/](https://dazzling-kelpie-426d25.netlify.app/)

## Sample Test Files

Use the included `.docx` files to run instant tests:

- [`passing-example.docx`](./test-documents/passing-copydoc.docx)
- [`failing-example.docx`](./test-documents/failing-copydoc.docx)

## Project Structure

```text
mops-test-assistant/
├── server/
│   ├── index.js              # Node server for file upload and test URL input
│   ├── scripts/
│   │   └── parse-doc.js      # Parses .docx files into structured data
│   └── fixtures/             # Auto-generated Cypress fixture (doc content)
├── cypress/
│   └── e2e/
│       └── dynamicTest.cy.js # Cypress test using the parsed doc
├── test-documents/
│   ├── passing-example.docx
│   └── failing-example.docx
├── public/
│   └── index.html            # Upload form and URL input UI
├── cypress.config.js
└── README.md
```

## Getting Started

Follow these steps to run the MOPS Test Assistant locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mops-test-assistant.git
cd mops-test-assistant
```

### 2. Install Dependencies

Cypress is already listed in `devDependencies`. Just run:

```bash
npm install
```

This installs all required packages, including Cypress.

### 3. Start the Node Server

Launch the local server (port 3000) that powers the upload form:

```bash
npm start
```

### 4. Open the Upload Interface (and Generate Test Fixture)

Navigate in your browser to:

```
http://localhost:3000
```

Use the form to:

- Upload a `.docx` copy dock (use provided examples in /test-documents).
- Enter the URL of the page you want to test.  
  _Example provided:_ [Sho-Daddy Demo](https://dazzling-kelpie-426d25.netlify.app/)

  ⚠️ Important: Uploading the .docx file triggers parsing and creates a test fixture (server/fixtures/testData.json). This must be done before running Cypress, or the test will fail due to missing data.

### 5. Launch Cypress

In a new terminal tab:

```bash
npx cypress open
```

Then:

- Select a browser (e.g., Chrome).
- Choose `dynamicTest.cy.js` from the Cypress interface.

### 6. Run the Test

After the .docx has been uploaded and the fixture generated, return to the Cypress test runner:

The test will compare the `.docx` content against the target page.

- Cypress will load the test fixture created from the uploaded document
- It will compare the document content against the live page at the test URL
- If you skip the upload step or modify files without uploading again, the test will not have valid data.
  You'll see real-time results:
- ✅ **Pass** — content matches the .docx
- ❌ **Fail** — mismatch or missing content

### 7. Re-run with Another Doc

To test another document:

- Go back to `http://localhost:3000`
- Upload a new `.docx`
- Enter the same or different test URL
- Re-run the test from Cypress

### 8. Note on Fixture Management

⚠️ Each time a .docx file is uploaded, a new fixture file is generated and stored in

```text
server/fixtures/
```

These files are used by Cypress to dynamically run tests based on your uploaded content. Over time this folder may accumulage a large number of fixture files.
Recommendation:
Periodically clarn out the server/fixtures/ folder to avoid clutter and maintain clarity in your test runs. You can delete old fixtures manually. We may add a cleanup script as a future enhancement.

## Future Plans & Possibilities

The MOPS Test Assistant is a foundation for broader QA automation. Future enhancements may include:

#### AI + Smart Parsing

- GoCass LLM Integration: Use GPT or other models to intelligently parse copy from:

- .docx copy decks

- Jira-style tickets

- Chat transcripts or inline comments

#### Figma Integration

- Pull content directly from Figma API (instead of .docx)

- Validate layout + content alignment between design and implementation

#### Test Management & Expansion

- Historical Fixture Archive: Keep multiple parsed test fixtures for:

  - Regression tracking

  - Side-by-side content/version comparisons

- Bulk Cypress Testing: Loop through multiple fixtures for end-to-end sweeps

#### Visual Validations

- Extend beyond text-based checks:

  - Add screenshot diffing

  - Compare spacing, fonts, layout breakpoints

#### TestLa Integration

- Integrate into GoDaddy’s TestLa or similar internal QA systems

- Make this tool a plug-and-play QA assistant for Marketing Ops & Site QE teams
