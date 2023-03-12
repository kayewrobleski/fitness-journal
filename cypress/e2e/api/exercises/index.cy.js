describe('/api/exercises', () => {

    before(() => {
        cy.task('db:seed');
    })

    context('GET', () => {
        context('when authenticated', () => {
            beforeEach(() => {
                cy.login('admin');
                cy.request('/api/exercises').as('exercises');
            })
    
            it('should have response status of OK', () => {
                cy.get('@exercises').should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should not return custom exercises created by other users', () => {
                const email = Cypress.env('admin_email');
                cy.get('@exercises').should((response) => {
                    response.body.forEach((exercise) => {
                        const isCreatedByCurrentUser = exercise.userEmail === email;
                        const isGlobal = exercise.global;
                        expect(isCreatedByCurrentUser || isGlobal);
                    })
                })
            });
    
        });
    
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    url: '/api/exercises',
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            const customExercise = {
                name: 'Custom exercise 1',
                movementPatternId: 1,
                primaryMuscles: ['quadriceps'],
                secondaryMuscles: ['gluteals']
            }
            const globalExercise = {
                name: 'Global exercise 1',
                movementPatternId: 1,
                primaryMuscles: [ 'quadriceps'],
                secondaryMuscles: ['gluteals']
            }

            it('should let admin role create a custom exercise', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: '/api/exercises',
                    form: true,
                    body: customExercise
                }).should((response) => {
                    expect(response.status).to.eq(201);
                })
            });
            it('should let user role create a custom exercise', () => {
                cy.login('user');
                cy.request({
                    method: 'POST',
                    url: '/api/exercises',
                    form: true,
                    body: customExercise
                }).should((response) => {
                    expect(response.status).to.eq(201);
                })
            });
            it('should let admin role create a global exercise', () => {
                cy.login('admin');
                cy.request({
                    method: 'POST',
                    url: '/api/exercises?global=true',
                    form: true,
                    body: globalExercise
                }).should((response) => {
                    expect(response.status).to.eq(201);
                })
            });
            it('should not let user role create a global exercise', () => {
                cy.login('user');
                cy.request({
                    method: 'POST',
                    url: '/api/exercises?global=true',
                    form: true,
                    failOnStatusCode: false,
                    body: globalExercise
                }).should((response) => {
                    expect(response.status).to.eq(401);
                })
            });

        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'POST',
                    url: '/api/exercises',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })

    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('admin');
                cy.request({
                    method: 'DELETE',
                    url: '/api/exercises',
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(405);
                });
            });
        })
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'DELETE',
                    url: '/api/exercises',
                    failOnStatusCode: false,
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
                    url: '/api/exercises',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                });
            });
        })
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PUT',
                    url: '/api/exercises',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it('should not allow method', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: '/api/exercises',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                });
            });
        })
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PATCH',
                    url: '/api/exercises',
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })
    
})