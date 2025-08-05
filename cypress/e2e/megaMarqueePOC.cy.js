describe("Mega Marquee POC: Fixture Test", () => {
  let fixture;

  before(() => {
    cy.viewport(1920, 1080);
    cy.request("http://localhost:3001/api/fixtures/mega-marquee").then(
      (res) => {
        fixture = res.body;
      }
    );

    cy.visit("https://www.godaddy.com/pro?contextState=draft");
  });

  it("Validates Mega Marquee text content from live fixture", () => {
    cy.get("[data-cy=headline-string]")
      .first()
      .should("contain.text", fixture.headline);
    cy.get("[data-cy=description]").should("contain.text", fixture.description);
  });
});
