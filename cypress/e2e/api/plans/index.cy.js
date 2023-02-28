describe('/api/plans', () => {

    before(() => {
        cy.task('db:seed');
    })

    context('GET', () => {

        context('when authenticated', () => {
            it('should have response status of OK', () => {
                cy.login('admin');
                cy.request('/api/plans').should((response) => {
                    expect(response.status).to.eq(200);
                })
            })

            it('should return plans for the authenticated user', () => {
                cy.login('admin');
                cy.request('/api/plans').should((response) => {
                    response.body.forEach(plan => {
                        expect(plan.userEmail).to.eq(Cypress.env('admin_email'));
                    })
                })

                cy.login('user');
                cy.request('/api/plans').should((response) => {
                    response.body.forEach(plan => {
                        expect(plan.userEmail).to.eq(Cypress.env('user_email'));
                    })
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'GET',
                    url: '/api/plans',
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            })
        });
    })
    context('POST', () => {

        context('when authenticated', () => {
        
            it('should have response status of Created', () => {
                cy.login('admin')
                cy.request({
                    method: 'POST',
                    url: '/api/plans',
                    body: {
                        name: 'Testing creating a plan'
                    },
                }).should((response) => {
                    expect(response.status).to.eq(201);
                })
            })

            it('should create plan for authenticated user', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: '/api/plans',
                    body: {
                        name: 'Testing creating a plan for admin'
                    }
                }).should((response) => {
                    expect(response.body.userEmail).to.eq(Cypress.env('admin_email'));
                })

                cy.login('user');
                cy.request({
                    method: 'POST',
                    url: '/api/plans',
                    body: {
                        name: 'Testing creating a plan for user'
                    }
                }).should((response) => {
                    expect(response.body.userEmail).to.eq(Cypress.env('user_email'));
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'POST',
                    url: '/api/plans',
                    body: {},
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            })
        });
        
    })
    context('DELETE', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('user');
                cy.request({
                    method: 'DELETE',
                    url: '/api/plans',
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            })
        });

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'DELETE',
                    url: '/api/plans',
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            })
        });
    })
    context('PUT', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('user');
                cy.request({
                    method: 'PUT',
                    url: '/api/plans',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            })
        });

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PUT',
                    url: '/api/plans',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            })
        });
        
    })
    context('PATCH', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('user');
                cy.request({
                    method: 'PATCH',
                    url: '/api/plans',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            })
        });

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PATCH',
                    url: '/api/plans',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            })
        });
        
    })
})