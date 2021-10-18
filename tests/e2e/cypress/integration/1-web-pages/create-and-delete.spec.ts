/// <reference types="cypress" />

describe("web/create/page & web/delete/page", () => {
  it("creates and deletes an About Us page", () => {
    cy.exec(
      "cd ../../../webstone-dev-app && pnpm ws web create page 'About Us'"
    )
      .its("code")
      .should("eq", 0);
    cy.visit("/about-us");
    cy.get("h1").should("have.text", "About Us");
    cy.visit("/");
    cy.exec("cd ../../../webstone-dev-app && pnpm ws web delete page about-us")
      .its("code")
      .should("eq", 0);
    cy.visit("/about-us", {
      failOnStatusCode: false,
    });
    cy.get("pre").should("contain.text", "Not found: /about-us");
  });
});
