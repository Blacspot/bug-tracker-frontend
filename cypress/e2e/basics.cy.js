
describe('UI Navigation', () => {
    beforeEach(() => {
        cy.viewport(1280, 720);
    })


    it("Should visit multiple pages", () => {
        cy.visit('/')

        cy.location("pathname").should("equal", "/")

        cy.getDataTest('hero-title').contains("Streamline Software with Smart Bug Tracking")

        cy.visit('/about')
        cy.location("pathname").should("equal", "/about")

        cy.getDataTest('about bug').contains("About Us")

        cy.visit('/register')

        cy.getDataTest('bug-registration-header').contains("Account Registration")

        cy.visit('/login')

        cy.getDataTest('bug-login-header').contains("Login")


    })
});
