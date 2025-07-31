const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

async function parseDoc(docPath, draftUrl) {
  console.log(`Parsing: ${docPath}`);

  const result = await mammoth.extractRawText({ path: docPath });
  const extractedText = result.value.trim();

  const matchedTests = [];

  function extractValue(label, text) {
    const regex = new RegExp(`${label}:\\s*(.+)`);
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  }

  // Dynamically parse Full Width Marquee
  if (extractedText.includes("Full Width Marquee")) {
    console.log("Matched module: Full Width Marquee");

    const h1 = extractValue("H1 Headline", extractedText);
    const description = extractValue("Description", extractedText);
    const ctaText = extractValue("CTA Text", extractedText);
    const ctaUrl = extractValue("CTA URL", extractedText);

    if (h1) {
      matchedTests.push({
        type: "h1",
        selector: "[data-cy='headline']",
        expected: h1,
      });
    }

    if (description) {
      matchedTests.push({
        type: "description",
        selector: "[data-cy='description']",
        expectedText: description,
      });
    }

    if (ctaText && ctaUrl) {
      matchedTests.push({
        type: "cta",
        selector: "[data-cy='marquee-start'] a.cta-style",
        expectedText: ctaText,
        expectedHref: ctaUrl,
      });
    }
  }

  // Still allow static test definitions for other modules
  const moduleTestMap = {
    "Mega Marquee": [
      {
        type: "h1",
        expected: "Power your clients’ success",
      },
      {
        type: "cta",
        selector: "[data-cy='cta']",
        expectedText: "Get Started",
        expectedHref: "/pricing",
        requiredAttributes: ["data-eid"],
      },
    ],
    "Multi Column Section": [
      {
        type: "component",
        selector: "[data-cy='card']",
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
  };

  for (const moduleName in moduleTestMap) {
    if (extractedText.includes(moduleName)) {
      console.log(`Matched module: ${moduleName}`);
      matchedTests.push(...moduleTestMap[moduleName]);
    }
  }

  const testFixture = {
    url: draftUrl,
    docPreview: extractedText.slice(0, 300),
    tests: matchedTests,
  };

  const fixturePath = path.resolve(__dirname, "../fixtures/auto-fixture.json");
  fs.writeFileSync(fixturePath, JSON.stringify(testFixture, null, 2));
  console.log("Test fixture written to:", fixturePath);
}

module.exports = parseDoc;
