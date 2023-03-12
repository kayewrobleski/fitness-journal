//TODO: Implement test cases
describe('/api/plans/[planId]/sets/[setId]/exercises/[exerciseId]', () => {
    context('GET', () => {
        context('when authenticated', () => {
            it.skip('should have response status of 200');
            it.skip('should return plan exercise with the provided id');
            it.skip('should not return plan exercise on another user\'s plan');
            it.skip('if plan id does not exist, should have response status of 404');
            it.skip('if set id does exist for provided plan, should have response status of 404');
            it.skip('if exercise id does not exist for the provide set, should have response status of 404');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it.skip('should have response status of 200');
            it.skip('should modify provided properties on plan exercise');
            it.skip('should not allow modifying plan exercise on another user\'s plan');
            it.skip('if plan id does not exist, should have response status of 404');
            it.skip('if set id does exist for provided plan, should have response status of 404');
            it.skip('if exercise id does not exist for the provide set, should have response status of 404');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it.skip('should have response status of 200');
            it.skip('should delete plan exercise with provided id');
            it.skip('should not allow deleting a plan exercise on another user\'s plan');
            it.skip('if plan id does not exist, should have response status of 404');
            it.skip('if set id does exist for provided plan, should have response status of 404');
            it.skip('if exercise id does not exist for the provide set, should have response status of 404');
        })
        context('when not authenticated', () => {
            it.skip('should have repsonse status of 403');
        })
    })
    
    context('POST', () => {
        context('when authenticated', () => {
            it.skip('should not allow method');
        })
        context('when not authenticated', () => {
            it.skip('should have response status of 403');
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