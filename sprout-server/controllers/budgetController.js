// Use the budget service to get the result data and return it back to the user

module.exports = (router) => {
    // Get all budgets for this account
    router.get('/budget', (req, res) => {
        res.send('GET Budget')
    });

    // Update a given budget
    router.put('/budget/:budgetId', () => {
        return "PUT Budget"
    });

    // Create a new budget
    router.post('/budget', () => {
        return "POST Budget"
    });
}