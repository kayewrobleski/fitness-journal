//TODO: Implement test cases
describe('/api/plans/[planId]/sets/[setId]/exercises', () => {
    context('GET', () => {
        context('when authenticated', () => {
            it.skip('should have response status of 200');
            it.skip('should return plan exercises for provided set id');
            it.skip('should not return plan exercises for another user\'s plan');
            it.skip('if plan id does not exist, should have response status of 404');
            it.skip('if set id does exist for provided plan, should have response status of 404');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })
    context('POST', () => {
        context('when authenticated', () => {
            it.skip('should have repsonse status of 201');
            it.skip('should create a new plan exercise for the provided set id');
            it.skip('should not allow creating a plan exercise on another user\'s plan');
            it.skip('should not allow creating a plan exercise using another user\'s exercise');
            it.skip('if plan id does not exist, should have response status of 404');
            it.skip('if set id does exist for provided plan, should have response status of 404');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of 403');
        })
    })
    context('DELETE', () => {
        context('when authenticated', () => {
            it.skip('should not allow method');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })
    context('PATCH', () => {
        context('when authenticated', () => {
            it.skip('should not allow method');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })
    context('PUT', () => {
        context('when authenticated', () => {
            it.skip('should not allow method');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })
})