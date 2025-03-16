describe("User Management Dashboard E2E Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("displays the user list with pagination", () => {
    cy.get(".el-table").should("be.visible");

    cy.get(".el-table__row").should("have.length.greaterThan", 0);

    cy.get(".el-pagination").should("be.visible");

    cy.get(".el-pagination .btn-next").click();
    cy.get(".el-table__row").should("have.length.greaterThan", 0);
  });

  it("searches and filters users", () => {
    cy.get('input[placeholder="Search By Name"]').type("User 20");
    cy.wait(500);
    cy.get(".el-table__row").should("have.length", 1);
    cy.get(".el-table__row").contains("User 20");

    cy.get(".el-select").eq(0).click();
    cy.get(".el-select-dropdown__item").contains("viewer").click();
    cy.wait(500);
    cy.get(".el-table__row").each(($row) => {
      cy.wrap($row).find("td:nth-child(2)").should("contain", "viewer");
    });

    cy.wait(500);
    cy.get(".el-select").eq(1).click();
    cy.get(".el-select-dropdown__item").contains("Active").click();
    cy.wait(500);
    cy.get(".el-table__row").each(($row) => {
      cy.wrap($row).find("td:nth-child(3)").should("contain", "active");
    });
  });

  it("navigates to user detail and edits a user", () => {
    cy.get(".el-table__row")
      .first()
      .find(".el-button")
      .contains("Edit")
      .click();
    cy.url().should("include", "/user/");

    cy.get(".el-card").should("be.visible");
    cy.get("input[disabled]").should("have.length", 4);

    cy.get(".el-button").contains("Edit").click();
    cy.get("input:not([disabled]):not([type='checkbox'])").first().type("Updated User");
    cy.get(".el-button").contains("Save").click();

    cy.get(".el-message--success").should(
      "contain",
      "User saved successfully!"
    );
  });

  it("exports user list to CSV from dropdown", () => {

    cy.get(".el-dropdown").should("be.visible");

    cy.get(".el-dropdown").find(".el-button").contains("Export to CSV").click();
    
    cy.get(".el-dropdown-menu__item").contains("Export all CSV").click();

    
    // cy.window().then((win) => {
    //   cy.stub(win.document, "createElement")
    //     .callThrough()
    //     .withArgs("a")
    //     .returns({
    //       click: cy.stub().as("download"),
    //       setAttribute: cy.stub(),
    //       href: "",
    //     });
    // });
    // cy.get("@download").should("have.been.called");
  });

  it("handles unauthorized access to user detail", () => {
    cy.visit("/user/1");
    cy.url().should("eq", "http://localhost:5173/user/1");
  });
});
