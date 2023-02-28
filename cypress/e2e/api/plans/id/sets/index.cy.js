describe('/api/plans/[id]/sets', () => {

    context('GET', () => {
        context('when authenticated', () => {
            it.todo('should have response status of OK');
            it.todo('should return all sets for the provided plan id');
            it.todo('should not return sets for another user\'s plan');
        })
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            it.todo('should have response status code of Created');
            it.todo('should create a set for the provided plan id');
            it.todo('should not allow creating a set for another user\'s plan');
        })
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it.todo('should not allow this method');
        })
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('PUT', () => {
        context('when authenticated', () => {
            it.todo('should not allow this method');
        })
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it.todo('should not allow this method');
        })
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })
})