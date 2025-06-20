const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function parseDoc(docPath, draftUrl) {
  console.log(`Parsing: ${docPath}`);

  const result = await mammoth.extractRawText({ path: docPath });
  const extractedText = result.value.trim();

  // Define known modules and test cases for each
  const moduleTestMap = {
    "Mega Marquee": [
      {
        type: "h1",
        expected: "Power your clients’ success",
      },
      {
        type: "cta",
        selector: "[data-cy='hero-cta']",
        expectedText: "Get Started",
        expectedHref: "/pricing",
        requiredAttributes: ["data-eid"],
      },
    ],
    "Feature Grid": [
      {
        type: "component",
        selector: "[data-cy='feature-card']",
        expectedCount: 3,
      },
    ],
    "SEO Block": [
      {
        type: "seo",
        title: "GoDaddy Pro - Tools for Web Pros",
        metaDescription: "Manage clients and websites easily",
        robots: "index,follow",
      },
    ],
    "Full Width Marquee": [
      {
        type: "h1",
        expected: "Bring your brand to life",
      },
      {
        type: "description",
        selector: "[data-cy='marquee-description']",
        expectedText:
          "Highlight your best features with bold imagery and messaging.",
      },
      {
        type: "cta",
        selector: "[data-cy='marquee-cta']",
        expectedText: "Explore Plans",
        expectedHref: "/plans",
        requiredAttributes: ["data-eid"],
      },
    ],
  };

  const matchedTests = [];

  for (const moduleName in moduleTestMap) {
    if (extractedText.includes(moduleName)) {
      console.log(`Matched module: ${moduleName}`);
      matchedTests.push(...moduleTestMap[moduleName]);
    }
  }

  const testFixture = {
    url: draftUrl,
    docPreview: extractedText.slice(0, 300), // optional preview
    tests: matchedTests,
  };

  const fixturePath = path.resolve(__dirname, "../fixtures/auto-fixture.json");
  fs.writeFileSync(fixturePath, JSON.stringify(testFixture, null, 2));
  console.log("Test fixture written to:", fixturePath);
}

module.exports = parseDoc;
