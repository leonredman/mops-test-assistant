describe("Full Width Marquee POC: Fixture Test", () => {
  before(() => {
    cy.viewport(1920, 1080);
    cy.visit("https://dazzling-kelpie-426d25.netlify.app/", {
      failOnStatusCode: false,
    });
  });

  it("Validates full-width marquee content from fixture", () => {
    cy.fixture("full-width-marquee.json").then((fixture) => {
      cy.get('[data-cy="headline"]').should("have.text", fixture.headline);
      cy.get('[data-cy="description"]').should(
        "have.text",
        fixture.description
      );
    });
  });
});
