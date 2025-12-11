// Intercepting the networks - mocking the API response

describe("registration  tests", () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('should register a user', () => {
        cy.getDataTest('bug-registration-header').contains("Account Registration")

        // Mock the signup API call with a successful response
        cy.intercept('POST', '/users', {
            statusCode: 201,
            body: {
                message: 'Registration successful! Logging you in...',
                user: {
                    username: "AdminUser",
                    email:"obwogs@gmail.com",
                    password: "12345678",
                    role: "admin"
                    
                }
            }
        }).as('signup')


        // Fill the form using data-test attributes
        cy.getDataTest('bug-username').as('bugusername')
        cy.get('@bugusername').type('AdminUser')


        cy.getDataTest('bug-email').as('bugemail')
        cy.get('@bugemail')
            .should('have.attr', 'type', 'email')
            .type('obwogs@gmail.com')


        cy.getDataTest('bug-password').as('bugpassword')
        cy.get('@bugpassword')
            .should('have.attr', 'type', 'password')
            .type('12345678');

        cy.getDataTest('bug-confirm-password').as('confirmPasswordInput')
        cy.get('@confirmPasswordInput')
            .should('have.attr', 'type', 'password')
            .type('12345678');

        // Submit the form
        cy.getDataTest('bug-register-submit').as('submitButton')
        cy.get('@submitButton')
            .should('contain.text', 'Register')
            .should('not.be.disabled')
            .click()
            .pause()

    })

    // it()
})