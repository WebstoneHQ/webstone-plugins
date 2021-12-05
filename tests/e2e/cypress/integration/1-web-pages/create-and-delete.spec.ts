/// <reference types="cypress" />

describe("web/page/create & web/page/delete", () => {
  it("creates and deletes an About Us page", () => {
    cy.exec(
      "cd ../../../webstone-dev-app && pnpm ws web page create 'About Us'"
    )
      .its("code")
      .should("eq", 0);
    cy.visit("/about-us");
    cy.get("h1").should("have.text", "About Us");
    cy.visit("/");
    cy.exec("cd ../../../webstone-dev-app && pnpm ws web page delete about-us")
      .its("code")
      .should("eq", 0);
    cy.visit("/about-us", {
      failOnStatusCode: false,
    });
    cy.get("pre").should("contain.text", "Not found: /about-us");
  });
});
