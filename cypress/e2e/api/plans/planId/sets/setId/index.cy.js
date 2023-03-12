const adminPlanIds = [1, 2];
const adminSetIds = [1, 2, 3, 4];
const userPlanIds = [3, 4];
const userSetIds = [5, 6, 7, 8];
describe('/api/plans/[planId]/sets/[setId]', () => {

    beforeEach(() => {
        cy.task('db:seed');
    })

    context('GET', () => {
        context('when authenticated', () => {
            it('should have responses status of 200', () => {
                cy.login('admin');
                cy.request(`/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should return set for provided id', () => {
                cy.login('admin');
                cy.request(`/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`).should((response) => {
                    expect(response.body).to.be.a('object');
                    expect(response.body.planId).to.eq(adminPlanIds[0]);
                })
            });
            it('should not return set for another user\'s plan', () => {
                cy.login('admin');
                cy.request({
                    url: `/api/plans/${userPlanIds[0]}/sets/${userSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })

                cy.login('user');
                cy.request({
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if plan id does not exist, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    url: `/api/plans/100/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if set id does exist for provided plan, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    url: `/api/plans/${adminPlanIds[0]}/sets/100`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })
        context('when not authenticated', () => {
            it('should have response status of 403', () => {
                cy.request({
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it('should have response status of 200', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    body: {
                        order: 2
                    }
                }).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should update set with the provided properties', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    body: {
                        order: 2
                    }
                }).then((response) => {
                    cy.log(response.body);
                    expect(response.body.order).to.eq(2);
                })
            });
            it('should not allow updating set on another user\'s plan', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${userPlanIds[0]}/sets/${userSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        order: 2
                    }
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })

                cy.login('user');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {
                        order: 2
                    }
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if plan id does not exist, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/100/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if set id does exist for provided plan, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}/sets/100`,
                    failOnStatusCode: false,
                    body: {}
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of 403', () => {
                cy.request({
                    method: 'PATCH',
                    url: `/api/plans/${adminPlanIds[0]}/sets/1`,
                    failOnStatusCode: false,
                    body: {
                        order: 1
                    }
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it('should have response status of 200', () => {
                cy.login('admin');
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                }).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should delete set with provided id', () => {
                cy.login('admin');
                // Delete plan set
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(200);
                })
                // Check that plan set was deleted
                cy.request({
                    method: 'GET',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('should not allow deleting set on another user\'s plan', () => {
                cy.login('user');
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })

                cy.login('admin');
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${userPlanIds[0]}/sets/${userSetIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if plan id does not exist, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/100/sets/${adminPlanIds[0]}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if set id does exist for provided plan, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}/sets/100`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of 403', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/plans/${adminPlanIds[0]}/sets/1`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            });
        })
        context('when not authenticated', () => {
            it('should have response status of 403', () => {
                cy.request({
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}/sets/1`,
                    failOnStatusCode: false,
                    body: {
                        order: 1,
                        planExercises: []
                    }
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })
    context('PUT', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('admin');
                cy.request({
                    method: 'PUT',
                    url: `/api/plans/${adminPlanIds[0]}/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            });
            it('if plan id does not exist, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'PUT',
                    url: `/api/plans/100/sets/${adminSetIds[0]}`,
                    failOnStatusCode: false,
                    body: {}
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })
            });
            it('if set id does exist for provided plan, should have response status of 404', () => {
                cy.login('admin');
                cy.request({
                    method: 'PUT',
                    url: `/api/plans/${adminPlanIds[0]}/sets/100`,
                    failOnStatusCode: false,
                    body: {}
                }).then((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of 403', () => {
                cy.request({
                    method: 'PUT',
                    url: `/api/plans/${adminPlanIds[0]}/sets/1`,
                    failOnStatusCode: false,
                    body: {
                        order: 1,
                        planExercises: []
                    }
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })
})