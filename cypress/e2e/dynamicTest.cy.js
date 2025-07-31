/// <reference types="cypress" />

describe("MOPS Test Assistant - Dynamic Test Runner", () => {
  let testData;

  before(() => {
    cy.task("loadFixtureFromServer").then((data) => {
      testData = data;
    });
  });

  // create beforeEach with cy.viewport 1920,1080
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it("Runs tests from dynamic fixture", () => {
    cy.visit(testData.url);

    testData.tests.forEach((test) => {
      switch (test.type) {
        case "h1":
          cy.get("h1").should("contain.text", test.expected);
          break;

        case "cta":
          cy.get(test.selector)
            .should("contain.text", test.expectedText)
            .should("have.attr", "href", test.expectedHref);

          if (test.requiredAttributes) {
            test.requiredAttributes.forEach((attr) => {
              cy.get(test.selector).should("have.attr", attr);
            });
          }
          break;

        case "description":
          cy.get(test.selector).should("contain.text", test.expectedText);
          break;

        case "component":
        case "table":
          cy.get(test.selector).should("have.length", test.expectedCount);
          break;

        case "seo":
          cy.title().should("eq", test.title);
          cy.get('meta[name="description"]').should(
            "have.attr",
            "content",
            test.metaDescription
          );
          cy.get('meta[name="robots"]').should(
            "have.attr",
            "content",
            test.robots
          );
          break;

        default:
          cy.log(`Unknown test type: ${test.type}`);
      }
    });
  });
});
