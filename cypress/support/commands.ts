/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
    return cy.get(`[data-test="${dataTestSelector}"]`)
})

// command to login
Cypress.Commands.add('loginAsAdmin', (email = 'test23@gmail.com', password = '12345678') => {
    cy.visit('/login')
    cy.getDataTest('bug-login-email').type(email)
    cy.getDataTest('bug-login-password').type(password)
    cy.getDataTest('bug-login-submit').click()

    cy.contains(/Login successful/i).should('be.visible')
    cy.url().should('include', '/adminpage')
    cy.contains(/Welcome back/i).should('be.visible')
})

/* eslint-disable @typescript-eslint/no-namespace */
export { }
declare global {
    namespace Cypress {
        interface Chainable {
            getDataTest(value: string): Chainable<JQuery<HTMLElement>>;
            loginAsAdmin(email: string, password: string): Chainable<void>
        }
    }
}