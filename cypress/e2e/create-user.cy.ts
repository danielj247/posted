describe("create user", () => {
  it("loads the create user page", () => {
    cy.visit("http://localhost:5173/");
    cy.contains("p", "Let us know what your name is so you can get posting!");
  });

  it("creates a user", () => {
    cy.visit("http://localhost:5173/");
    cy.get("#new-user-name").type("Test User");
    cy.get("#new-user-submit").should("not.be.disabled");
    cy.get("#new-user-submit").click();
    cy.contains("p", "Welcome back, Test User");
  });

  it("creates a user with a middle name", () => {
    cy.visit("http://localhost:5173/");
    cy.get("#new-user-name").type("Test Middle User");
    cy.get("#new-user-submit").should("not.be.disabled");
    cy.get("#new-user-submit").click();
    cy.contains("p", "Welcome back, Test Middle User");
  });
});
