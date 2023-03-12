/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// Cypress.Commands.add('seed', () => {
//     cy.exec('npx prisma db seed');
// })

declare global {
  namespace Cypress {
    interface Chainable {
      login(role: string): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

Cypress.Commands.add('login', (role) => {
    // Get credentials for role
    const email = Cypress.env(`${role}_email`);
    const password = Cypress.env(`${role}_password`);

    // Create a new session
    cy.session(role, () => {

        // Get csrf token
        cy.request('/api/auth/csrf/credentials').then((response) => {
            const csrfToken = response.body.csrfToken;
            console.log(csrfToken);

            // Sign in using credentials
            cy.request({
                method: 'POST',
                url: '/api/auth/callback/credentials',
                form: true,
                body: {
                    csrfToken,
                    email,
                    password,
                    json: true
                }
            })

            // Validate that session cookie was set
            cy.getCookie('next-auth.session-token').should('exist');
        })
    })    
})

export {};