import { ID_LOGIN_INPUT, ID_LOGIN_BUTTON, ID_USER_MENU } from "../constants";

describe("auth", () => {
  it("logs a user in", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Check the user is logged in
    cy.contains("p", "Welcome back, Test User");
  });

  it("redirects when not logged in", () => {
    cy.visit("http://localhost:5173/feed");
    cy.contains("p", "Let us know what your name is so you can get posting!");
  });

  it("logs a user out", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Check the user is logged in
    cy.contains("p", "Welcome back, Test User");

    // Open user menu
    cy.get(ID_USER_MENU).click();

    // Click logout
    cy.contains("p", "Sign out").click();

    // Check the user is logged out
    cy.contains("p", "Let us know what your name is so you can get posting!");
  });

  it("redirects when logged in", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Check the user is logged in
    cy.contains("p", "Welcome back, Test User");

    // Visit the login page
    cy.visit("http://localhost:5173/");

    // Check the user is redirected
    cy.contains("p", "Welcome back, Test User");
  });
});
