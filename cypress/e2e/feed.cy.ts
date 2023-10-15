import {
  ID_LOGIN_INPUT,
  ID_LOGIN_BUTTON,
  ID_COMMENT_DRAWER_BUTTON,
  ID_NEW_POST_BUTTON,
  ID_POST_MODAL_TITLE,
  ID_POST_MODAL_BODY,
  ID_POST_MODAL_SUBMIT,
  ID_NEW_COMMENT_TITLE_INPUT,
  ID_NEW_COMMENT_BODY_INPUT,
  ID_NEW_COMMENT_SUBMIT_BUTTON,
  ID_FIRST_POST_FIRST_COMMENT_MENU,
  ID_DELETE_MODAL_BUTTON,
  ID_COMMENT_MODAL_TITLE,
  ID_COMMENT_MODAL_BODY,
  ID_COMMENT_MODAL_SUBMIT,
  ID_MORE_MENU_BUTTON,
  ID_MORE_MENU_BUTTON_NEW,
} from "../constants";

describe("feed page", () => {
  it("should display a list of posts", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Check posts exist
    cy.contains("p", "at nam consequatur ea labore ea harum");
    cy.contains("p", "temporibus sit alias delectus eligendi possimus magni");
    cy.contains("p", "laboriosam dolor voluptates");
  });

  it("should display comments when clicking on a post", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Check posts exist
    cy.contains("p", "at nam consequatur ea labore ea harum");

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Check first comment and it's sibling matches the data
    cy.contains("p", "et occaecati asperiores quas voluptas ipsam nostrum")
      .siblings("p")
      .contains(
        "neque unde voluptatem iure odio excepturi ipsam ad id ipsa sed expedita error quam voluptatem tempora necessitatibus suscipit culpa veniam porro iste vel",
      );
  });

  it("allows a user to create a new post", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open new post modal
    cy.get(ID_NEW_POST_BUTTON).click();
    // Check modal is open
    cy.contains("h3", "New post");
    // Fill out form and submit
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Check modal is closed
    cy.contains("h3", "New post").should("not.exist");

    // Check new post exists
    cy.contains("p", "This is a new post");
  });

  it("stops a user from creating a new post if the title is empty", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open new post modal
    cy.get(ID_NEW_POST_BUTTON).click();

    // Fill out form except title and submit
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");

    // Check submit button is disabled
    cy.get(ID_POST_MODAL_SUBMIT).should("be.disabled");

    // Check post doesn't exist
    cy.contains("p", "This is a new post").should("not.exist");
  });

  it("stops a user from creating a new post if the body is empty", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open new post modal
    cy.get(ID_NEW_POST_BUTTON).click();

    // Fill out form except title and submit
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");

    // Check submit button is disabled
    cy.get(ID_POST_MODAL_SUBMIT).should("be.disabled");

    // Check post doesn't exist
    cy.contains("p", "This is a new post").should("not.exist");
  });

  it("allows a user to create a new comment", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Add new comment
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a new comment");
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is the body of the new comment");
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).click();

    // Check new comment exists
    cy.contains("p", "This is the body of the new comment");
  });

  it("allows a user to delete their comment", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Add new comment
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a new comment");
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is the body of the new comment");
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).click();

    // Open more menu
    cy.get(ID_FIRST_POST_FIRST_COMMENT_MENU).click();

    // Click delete comment
    cy.contains("Delete comment").click();

    // Click delete modal button
    cy.get(ID_DELETE_MODAL_BUTTON).click();

    // Modal closed
    cy.contains("p", "Are you sure you want to delete this comment?").should("not.exist");

    // Check comment doesn't exist
    cy.contains("p", "This is the body of the new comment").should("not.exist");
  });

  it("allows a user to edit their comment", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Add new comment
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a new comment");
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is the body of the new comment");
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).click();

    // Open more menu
    cy.get(ID_FIRST_POST_FIRST_COMMENT_MENU).click();

    // Click edit comment
    cy.contains("Edit comment").click();

    // Check modal is open
    cy.contains("h3", "Edit comment");

    // Fill out form and submit
    cy.get(ID_COMMENT_MODAL_TITLE).type(", now edited!");
    cy.get(ID_COMMENT_MODAL_BODY).type(", you guess it! Also edited.");
    cy.get(ID_COMMENT_MODAL_SUBMIT).click();

    // Check modal is closed
    cy.contains("h3", "Edit comment").should("not.exist");

    // Check comment has been edited
    cy.contains("p", "This is the body of the new comment, you guess it! Also edited.");
  });

  it("stops a user from creating a new comment if the title is empty", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Fill out form except title and submit
    cy.get(ID_NEW_COMMENT_BODY_INPUT).type("This is the body of the new comment");

    // Check submit button is disabled
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).should("be.disabled");

    // Check comment doesn't exist
    cy.contains("p", "This is the body of the new comment").should("not.exist");
  });

  it("stops a user from creating a new comment if the body is empty", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open comments
    cy.get(ID_COMMENT_DRAWER_BUTTON).click();

    // Fill out form except title and submit
    cy.get(ID_NEW_COMMENT_TITLE_INPUT).type("This is a new comment");

    // Check submit button is disabled
    cy.get(ID_NEW_COMMENT_SUBMIT_BUTTON).should("be.disabled");

    // Check comment doesn't exist
    cy.contains("p", "This is the body of the new comment").should("not.exist");
  });

  it("allows a user to view a post via more menu", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Click view post
    cy.contains("View post").click();

    // Check navigated to post page
    cy.contains("a", "Go back to feed");

    // Check post exists
    cy.contains("p", "at nam consequatur ea labore ea harum");
  });

  it("doesn't render the edit or delete menu items if the post is not owned by the user", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Open more menu
    cy.get(ID_MORE_MENU_BUTTON).click();

    // Check edit and delete menu items don't exist
    cy.contains("Edit post").should("not.exist");
    cy.contains("Delete post").should("not.exist");
  });

  it("allows a user to edit a post via more menu", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Add new post
    cy.get(ID_NEW_POST_BUTTON).click();

    // Fill out form and submit
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Open more menu
    cy.get(ID_MORE_MENU_BUTTON_NEW).click();

    // Click edit post
    cy.contains("Edit post").click();

    // Check modal is open
    cy.contains("h3", "Edit post");

    // Fill out form and submit
    cy.get(ID_POST_MODAL_TITLE).type(", now edited!");
    cy.get(ID_POST_MODAL_BODY).type(", you guess it! Also edited.");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Check modal is closed
    cy.contains("h3", "Edit post").should("not.exist");

    // Check post has been edited
    cy.contains("p", "This is a new post, now edited!");
  });

  it("allows a user to delete a post via more menu", () => {
    // Login
    cy.visit("http://localhost:5173/");
    cy.get(ID_LOGIN_INPUT).type("Test User");
    cy.get(ID_LOGIN_BUTTON).click();

    // Add new post
    cy.get(ID_NEW_POST_BUTTON).click();

    // Fill out form and submit
    cy.get(ID_POST_MODAL_TITLE).type("This is a new post");
    cy.get(ID_POST_MODAL_BODY).type("This is the body of the new post");
    cy.get(ID_POST_MODAL_SUBMIT).click();

    // Open more menu
    cy.get(ID_MORE_MENU_BUTTON_NEW).click();

    // Click delete post
    cy.contains("Delete post").click();

    // Check modal is open
    cy.contains("p", "Are you sure you want to delete this post?");

    // Click delete post
    cy.get(ID_DELETE_MODAL_BUTTON).click();

    // Check modal is closed
    cy.contains("p", "Are you sure you want to delete this post?").should("not.exist");

    // Check post has been deleted
    cy.contains("p", "This is a new post").should("not.exist");
  });

  // it("allows the user to load more posts", () => {});
  // it("stops the user from loading more than the maximum posts", () => {});
  // it("allows the user to load more comments", () => {});
  // it("stops the user from loading more than the maximum comments", () => {});
  // it("allows the user to load all the comments for a post", () => {});
  // it("allows the user to load more posts and comments", () => {});
  // it("allows the user to sort posts by ascending order", () => {});
  // it("allows the user to sort posts by descending order", () => {});
  // it("allows the user to search for posts", () => {});
  // it("allows the user to filter posts by user", () => {});
});
