/// <reference types="cypress" />

describe("web/api/create & web/api/delete", () => {
  it("creates and deletes CRUD API endpoints for /api/users", () => {
    cy.exec("cd ../../../webstone-dev-app && pnpm ws web api create /api/users")
      .its("code")
      .should("eq", 0);

    cy.request("GET", "/api/users").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("GET /api/users => Ok.");
    });
    cy.request("POST", "/api/users").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("POST /api/users => Ok.");
    });
    cy.request("DELETE", "/api/users/123").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("DELETE /api/users/123 => Ok.");
    });
    cy.request("PATCH", "/api/users/123").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("PATCH /api/users/123 => Ok.");
    });
    cy.request("PUT", "/api/users/123").should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("PUT /api/users/123 => Ok.");
    });

    cy.exec("cd ../../../webstone-dev-app && pnpm ws web api delete /api/users")
      .its("code")
      .should("eq", 0);

    cy.request({
      method: "GET",
      url: "/api/users",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
    cy.request({
      method: "POST",
      url: "/api/users",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
    cy.request({
      method: "DELETE",
      url: "/api/users/123",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
    cy.request({
      method: "PATCH",
      url: "/api/users/123",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
    cy.request({
      method: "PUT",
      url: "/api/users/123",
      failOnStatusCode: false,
    })
      .its("status")
      .should("eq", 404);
  });
});
