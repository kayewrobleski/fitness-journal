describe('test suite', () => {

    before(() => {
        cy.task('db:seed');
    })
    it('should pass', () => {
        console.log('test');
    })
})