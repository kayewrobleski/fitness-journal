describe('/api/plans/[planId]', () => {

    const adminPlanIds = [1, 2];
    const userPlanIds = [3, 4];

    beforeEach(() => {
        cy.task('db:seed');
    })

    context('GET', () => {
        context('when authenticated', () => {
            it('should have repsonse status of OK', () => {
                cy.login('admin');
                cy.request(`/api/plans/${adminPlanIds[0]}`).should((response) => {
                    expect(response.status).to.eq(200);
                });
            });
            it('should return plan with provided id', () => {
                cy.login('admin');
                cy.request(`/api/plans/${adminPlanIds[0]}`).should((response) => {
                    expect(response.body).to.be.a('object');
                    expect(response.body.id).to.eq(adminPlanIds[0]);
                });
            });
            it('should not return plan created by another user', () => {
                cy.login('admin');
                cy.request({
                    url: `/api/plans/${userPlanIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });

                cy.login('user');
                cy.request( {
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false 
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });
            });
            it('when plan id does not exist, should have status of 404', () => {
                cy.login('user');
                cy.request( {
                    url: `/api/plans/100}`,
                    failOnStatusCode: false 
                }).should((response) => {
                    expect(response.status).to.eq(404);
                });
            });
        });
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request( {
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false 
                }).should((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it('should have repsonse status of OK', () => {
                const newName = 'Testing patch for plan'
                cy.login('admin');
                cy.request( {
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        name: newName
                    }
                }).should((response) => {
                    expect(response.status).to.eq(200);
                });
            });
            it('should modify provided properties of plan', () => {
                const newName = 'Testing patch for plan'
                cy.login('admin');
                cy.request( {
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        name: newName
                    }
                }).should((response) => {
                    expect(response.body.name).to.eq(newName);
                });
            });
            it('should not allow modifying a plan created by another user', () => {
                const newName = 'This should not work';
                cy.login('admin');
                cy.request( {
                    method: 'PATCH',
                    url: `/api/plans/${userPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        name: newName
                    }
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });

                cy.login('user');
                cy.request( {
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        name: newName
                    }
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });

                // Check that patch changes were not made
                cy.login('admin');
                cy.request(`/api/plans/${adminPlanIds[0]}`).should((response) => {
                    expect(response.body.name).not.to.eq(newName);
                });
                cy.login('user');
                cy.request(`/api/plans/${userPlanIds[0]}`).should((response) => {
                    expect(response.body.name).not.to.eq(newName);
                });
            });
        });
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it('should have repsonse status of OK', () => {
                cy.login('user');
                cy.request( {
                    method: 'DELETE',
                    url: `/api/plans/${userPlanIds[0]}`,
                }).should((response) => {
                    expect(response.status).to.eq(200);
                });
            });
            it('should delete plan with provided id', () => {
                cy.login('user');
                cy.request( {
                    method: 'DELETE',
                    url: `/api/plans/${userPlanIds[0]}`,
                }).should((response) => {
                    expect(response.body).to.be.a('object');
                });

                // Check that plan was deleted
                cy.request( {
                    url: `/api/plans/${userPlanIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                });
            });
            it('should not allow deleting a plan created by another user', () => {
                cy.login('user');
                cy.request( {
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });

                // Check that plan was not deleted
                cy.login('admin');
                cy.request( {
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.id).to.eq(adminPlanIds[0]);
                });
            });
        });
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                }).should((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            it('should not allow this method', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                });
            });
        });
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        })
    })

    context('PUT', () => {
        context('when authenticated', () => {
            it('should not allow this method', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                });
            });
        });
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        })
    })
})