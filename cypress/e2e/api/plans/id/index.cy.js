describe('/api/plans/[id]', () => {

    context('GET', () => {
        context('when authenticated', () => {
            it.todo('should have repsonse status of OK');
            it.todo('should return plan with provided id');
            it.todo('should not return plan created by another user');
        });
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('PATCH', () => {
        context('when authenticated', () => {
            it.todo('should have repsonse status of OK');
            it.todo('should modify provided properties of plan');
            it.todo('should not allow modifying a plan created by another user');
        });
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('DELETE', () => {
        context('when authenticated', () => {
            it.todo('should have repsonse status of OK');
            it.todo('should delete plan with provided id');
            it.todo('should not allow deleting a plan created by another user');
        });
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('POST', () => {
        context('when authenticated', () => {
            it.todo('should not allow this method');
        });
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })

    context('PUT', () => {
        context('when authenticated', () => {
            it.todo('should not allow this method');
        });
        context('when not authenticated', () => {
            it.todo('should have response status of Unauthorized');
        })
    })
})