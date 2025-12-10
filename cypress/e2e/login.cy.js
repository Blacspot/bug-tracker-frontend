describe("login tests", () => {

    beforeEach(() => {
        cy.visit('/login') //cypress is on the login page
    })

    it("should login with valid credentials", () => {
        cy.getDataTest('bug-login-header').contains("Login")

        cy.getDataTest('bug-login-email').as('bug-loginemail')

        cy.get('@bug-loginemail')
            .should('be.visible')
            .should('have.attr', 'type', 'email')
            .type('test23@gmail.com')


        cy.getDataTest('bug-login-password').as('bug-loginpassword')

        cy.get('@bug-loginpassword')
            .should('be.visible')
            .should('have.attr', 'type', 'password')
            .type('12345678')


        cy.getDataTest('bug-login-submit').as('bug-loginsubmit')
        cy.get('@bug-loginsubmit')
            .should('contain.text', 'Login')
            .should('not.be.disabled')
            .click()
        cy.wait(2000)

        cy.contains(/Login successful/i).should('be.visible')
        cy.url().should('include', '/adminpage')
        //cy.contains(/Welcome back/i).should('be.visible')

    })

    it("should not login with invalid credentials", () => {

        // Get the email input
        cy.getDataTest('bug-login-email').as('bug-loginemail')
        cy.get('@bug-loginemail')
            .type('test23@gmail.com')

        // Get the password input
        cy.getDataTest('bug-login-password').as('bug-loginpassword')
        cy.get('@bug-loginpassword')
            .type('wrongpassword123')

        // Submit the form
        cy.getDataTest('bug-login-submit').as('bug-loginsubmit')
        cy.get('@bug-loginsubmit')
            .should('contain.text', 'Login')
            .click()

            cy.wait(2000)

        cy.contains(/Login failed/i).should('be.visible')

    })
})