describe('/api/exercises/[exerciseId]', () => {

    // exercise id for global exercise
    const globalExerciseId = 1;
    // exercise id for custom exercise created by admin role
    const adminExerciseId = 3;
    // exercise is for custom exercise created by user role
    const userExerciseId = 4;

    beforeEach(() => {
        cy.task('db:seed');
    })

    context('GET', () => {

        context('when authenticated', () => {
            it('should have response status of OK', () => {
                cy.login('admin');
                cy.request(`/api/exercises/${globalExerciseId}`).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should return global exercise for any user', () => {
                cy.login('admin');
                cy.request(`/api/exercises/${globalExerciseId}`).should((response) => {
                    expect(response.body).to.be.a('object');
                })
                cy.login('user');
                cy.request(`/api/exercises/${globalExerciseId}`).should((response) => {
                    expect(response.body).to.be.a('object');
                })
            });
            it('if exercise was created by authenticated user, should return custom exercise', () => {
                cy.login('admin');
                cy.request(`/api/exercises/${adminExerciseId}`).should((response) => {
                    expect(response.body).to.be.a('object');
                })

                cy.login('user');
                cy.request(`/api/exercises/${userExerciseId}`).should((response) => {
                    expect(response.body).to.be.a('object');
                })
            });
            it('should not return exercise created by another user', () => {
                cy.login('admin');
                cy.request({
                    url: `/api/exercises/${userExerciseId}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(401);
                })

                cy.login('user');
                cy.request({
                    url: `/api/exercises/${adminExerciseId}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(401);
                })
            });
            it('if exercise id does not exist, should have response status of Not Found', () => {
                cy.login('admin');
                cy.request({
                    method: 'GET',
                    url: `/api/exercises/100`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    url: `/api/exercises/${globalExerciseId}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('PATCH', () => {

        context('when authenticated', () => {
            it('should have a response status of OK', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/exercises/${globalExerciseId}`,
                    body: {
                        name: 'Testing patch exercise'
                    }
                }).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should modify provided properties of exercise', () => {
                const newName = 'Testing patch exercise';
                let exercise;
                cy.login('admin');

                cy.request(`/api/exercises/${adminExerciseId}`).should((response) => {
                    exercise = response.body;
                });

                cy.request({
                    method: 'PATCH',
                    url: `/api/exercises/${adminExerciseId}`,
                    body: {
                        name: newName
                    }
                }).should((response) => {
                    expect(response.body.name).to.eq(newName);
                    expect(response.body.movementPatternId).to.eq(exercise.movementPatternId);
                    expect(response.body.primaryMuscles).to.deep.eq(exercise.primaryMuscles);
                    expect(response.body.secondaryMuscles).to.deep.eq(exercise.secondaryMuscles);
                });
            });
            it('should not allow modifying an exercise created by another user', () => {
                cy.login('admin')
                cy.request({
                    method: 'PATCH',
                    url: `/api/exercises/${userExerciseId}`,
                    failOnStatusCode: false,
                    body: {
                        name: 'This should not work'
                    }
                }).should((response) => {
                    expect(response.status).to.eq(401);
                });
            });
            it('if exercise id does not exist, should have response status of Not Found', () => {
                cy.login('admin');
                cy.request({
                    method: 'PATCH',
                    url: `/api/exercises/100`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'PATCH',
                    url: `/api/exercises/${globalExerciseId}`,
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
            let exerciseToDelete;
            beforeEach(() => {
                cy.login('admin');
                // Create dummy exercise
                cy.request({
                    method: 'POST',
                    url: `/api/exercises`,
                    failOnStatusCode: false,
                    body: {
                        name: 'Dummy exercise',
                        movementPatternId: 1,
                        primaryMuscles: [],
                        secondaryMuscles: []
                    }
                }).should((response) => {
                    expect(response.status).to.eq(201);
                    exerciseToDelete = response.body.id;
                })
            })
            it('should have a repsonse status of OK', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/${exerciseToDelete}`
                }).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });

            it('should delete exercise', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/${exerciseToDelete}`
                }).should((response) => {
                    expect(response.body).to.be.a('object');
                })

                // Check that exercise was deleted
                cy.request({
                    method: 'GET',
                    url: `/api/exercises/${exerciseToDelete}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });

            it('should not allow deleting an exercise created by another user', () => {
                cy.login('user');
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/${exerciseToDelete}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(401);
                })
            });

            it('if exercise id does not exist, should have response status of Not Found', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/100`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(404);
                })
            });

            it('if exercise is used in a plan, should have response status of Conflict', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/${globalExerciseId}`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(409);
                })
            });
        })

        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'DELETE',
                    url: `/api/exercises/${globalExerciseId}`,
                    failOnStatusCode: false,
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
                    url: `/api/exercises/${globalExerciseId}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(405);
                })
            })
        })
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    method: 'POST',
                    url: `/api/exercises/${globalExerciseId}`,
                    failOnStatusCode: false,
                    body: {}
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

})