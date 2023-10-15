import {
  ID_LOGIN_INPUT,
  ID_LOGIN_BUTTON,
  ID_MORE_MENU_BUTTON,
  ID_NEW_COMMENT_TITLE_INPUT,
  ID_NEW_COMMENT_BODY_INPUT,
  ID_NEW_COMMENT_SUBMIT_BUTTON,
  ID_FIRST_POST_FIRST_COMMENT_MENU,
  ID_DELETE_MODAL_BUTTON,
  ID_NEW_POST_BUTTON,
  ID_POST_MODAL_BODY,
  ID_POST_MODAL_SUBMIT,
  ID_POST_MODAL_TITLE,
  ID_MORE_MENU_BUTTON_NEW,
} from "../constants";

describe("post page", () => {
  it("should display a post", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Click on "View post"
    cy.contains("View post").click();

    // Check the post page is displayed
    cy.contains("p", "at nam consequatur ea labore ea harum")
      .siblings("p")
      .contains(
        "cupiditate quo est a modi nesciunt soluta ipsa voluptas error itaque dicta in autem qui minus magnam et distinctio eum accusamus ratione error aut",
      );
  });

  it("should allow a user to create a new comment", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Click on "View post"
    cy.contains("View post").click();

    // Add a comment
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a comment title");
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is a comment body");
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).click();

    // Check the comment exists
    cy.contains("p", "This is a comment title").siblings("p").contains("This is a comment body");
  });

  it("should allow a user to delete a comment", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Click on "View post"
    cy.contains("View post").click();

    // Add a comment
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a comment title");
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is a comment body");
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).click();

    // Open the comments more menu
    cy.get(ID_FIRST_POST_FIRST_COMMENT_MENU).click();

    // Click on "Delete comment"
    cy.contains("Delete comment").click();

    // Click on "Delete" in the modal
    cy.get(ID_DELETE_MODAL_BUTTON).click();

    // Check the comment is deleted
    cy.contains("p", "This is a comment title").should("not.exist");
    cy.contains("p", "This is a comment body").should("not.exist");
  });

  it("should not render the more menu if not owned", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Click on "View post"
    cy.contains("View post").click();

    // Comments more menu should not be visible
    cy.get(ID_FIRST_POST_FIRST_COMMENT_MENU).should("not.exist");
  });

  it("should allow the user to delete their own post", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Add post
    cy.get(ID_NEW_POST_BUTTON).click();
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON_NEW).click();

    // Click on "View post"
    cy.contains("View post").click();

    // open the post page more menu
    cy.get("#more-menu").click();

    // Click on "Delete post"
    cy.contains("Delete post").click();

    // Click on "Delete" in the modal
    cy.get(ID_DELETE_MODAL_BUTTON).click();

    // Check the post is deleted
    cy.contains("p", "This is a new post").should("not.exist");

    // Check url is back to /feed
    cy.url().should("eq", "http://localhost:5173/feed");
  });

  it("should allow the user to edit their own post", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Add post
    cy.get(ID_NEW_POST_BUTTON).click();
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Open the more menu
    cy.get(ID_MORE_MENU_BUTTON_NEW).click();

    // Click on "View post"
    cy.contains("View post").click();

    // open the post page more menu
    cy.get("#more-menu").click();

    // Click on "Edit post"
    cy.contains("Edit post").click();

    cy.get(ID_POST_MODAL_TITLE).type(", now edited!");
    cy.get(ID_POST_MODAL_BODY).type(", you guess it! Also edited.");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Check modal is closed
    cy.contains("h3", "Edit comment").should("not.exist");

    // Check the post is edited
    cy.contains("p", "This is a new post, now edited!")
      .siblings("p")
      .contains("This is the body of the new post, you guess it! Also edited.");
  });
});
