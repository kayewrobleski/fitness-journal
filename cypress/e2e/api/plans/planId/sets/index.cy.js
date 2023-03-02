import _, { setWith } from 'lodash';

describe('/api/plans/[planId]/sets', () => {

    const adminPlanIds = [1, 2];
    const userPlanIds = [3, 4];
    const globalExercises = [1, 2];
    const adminExercises = [3];
    const userExercises = [4];
    const setWithExercises = {
        order: 0,
        planExercises: [
            {
                exerciseId: globalExercises[1],
                order: 0
            },
            {
                exerciseId: globalExercises[0],
                order: 1,
                targetVolume: [
                    {
                        sets: 3,
                        minReps: 1,
                        maxReps: 3,
                        rest: 90
                    }
                ]
            },
            {
                exerciseId: adminExercises[0],
                order: 2,
                targetVolume: [
                    {
                        sets: 2,
                        minReps: 1,
                        maxReps: 3,
                        rest: 60
                    },
                    {
                        sets: 1,
                        minReps: 5,
                        maxReps: 8,
                        rest: 60
                    }
                ]
            }
        ]
    };

    beforeEach(() => {
        cy.task('db:seed');
    })

    context('GET', () => {
        context('when authenticated', () => {
            it('should have response status of OK', () => {
                cy.login('admin');
                cy.request(`api/plans/${adminPlanIds[0]}/sets`).should((response) => {
                    expect(response.status).to.eq(200);
                })
            });
            it('should return all sets for the provided plan id', () => {
                cy.login('admin');
                cy.request(`api/plans/${adminPlanIds[0]}/sets`).should((response) => {
                    expect(response.body).to.be.a('array');
                })
            });
            it('should not return sets for another user\'s plan', () => {
                cy.login('user');
                cy.request({
                    url: `api/plans/${adminPlanIds[0]}/sets`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })

                cy.login('admin');
                cy.request({
                    url: `api/plans/${userPlanIds[0]}/sets`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
            it('when plan id does not exist, should have status of 404', () => {
                cy.login('admin');
                cy.request( {
                    url: `/api/plans/100/sets`,
                    failOnStatusCode: false 
                }).should((response) => {
                    expect(response.status).to.eq(404);
                });
            });
        })
        context('when not authenticated', () => {
            it('should have response status of Unauthorized', () => {
                cy.request({
                    url: `api/plans/${adminPlanIds[0]}/sets`,
                    failOnStatusCode: false
                }).should((response) => {
                    expect(response.status).to.eq(403);
                })
            });
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            it('should have response status code of Created', () => {
                cy.login('admin');
                cy.request( {
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}/sets`,
                    body: {
                        exerciseId: 1,
                        order: 0
                    }
                }).should((response) => {
                    expect(response.status).to.eq(201);
                });
            });
            it('should create a set for the provided plan id', () => {
                cy.login('admin');
                cy.request( {
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}/sets`,
                    body: {
                        order: 0
                    }
                }).should((response) => {
                    expect(response.body).to.be.a('object');
                    expect(response.body.planId).to.eq(adminPlanIds[0]);
                });
            });
            it('should create nested planExercises and targetVolume', () => {
                cy.login('admin');
                cy.request( {
                    method: 'POST',
                    url: `/api/plans/${adminPlanIds[0]}/sets`,
                    body: setWithExercises
                }).should((response) => {
                    expect(response.body).to.be.a('object');
                    expect(response.body.planId).to.eq(adminPlanIds[0]);
                    const sortedResponseExercises = _.sortBy(response.body.planExercises, [ 'order' ]);
                    const sortedRequestExercises = _.sortBy(setWithExercises.planExercises, [ 'order' ]);
                    expect(sortedResponseExercises.length).to.eq(sortedRequestExercises.length);
                    expect(sortedResponseExercises[0].targetVolume.length).to.eq(sortedRequestExercises[0].targetVolume?.length || 0)
                    expect(sortedResponseExercises[1].targetVolume.length).to.eq(sortedRequestExercises[1].targetVolume?.length || 0)
                    expect(sortedResponseExercises[2].targetVolume.length).to.eq(sortedRequestExercises[2].targetVolume?.length || 0)
                });
            });
            it.skip('should not allow creating a set for another user\'s plan');
            it.skip('should not allow creating a set with another user\'s exercise');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of Unauthorized');
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it.skip('should not allow this method');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of Unauthorized');
        })
    })

    context('PUT', () => {
        context('when authenticated', () => {
            it.skip('should not allow this method');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of Unauthorized');
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it.skip('should not allow this method');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of Unauthorized');
        })
    })
})