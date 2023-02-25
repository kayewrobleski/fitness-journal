const { createJSDocTypeExpression } = require("typescript");

describe('test suite', () => {

    before(() => {
        cy.task('db:seed').then(() => {
            cy.login('admin');
            cy.login('user');
        })
    })

    it('should pass', () => {
        Cypress.session.getSession('admin');
        Cypress.session.getSession('user');
        console.log('test');
    })
})