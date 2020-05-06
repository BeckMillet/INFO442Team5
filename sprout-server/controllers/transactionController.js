const transactionService = require('../services/transactionService');
module.exports = (router) => {
    // Get all transactions associated with this account
    router.get('/transactions', (req, res) => {

        res.send(transactionService.getData())
    });

    // Update an existing transaction (maybe not needed)
    router.put('/budget/transactions', () => {
        res.send('PUT Transactions')
    });

    // Post a new transaction
    router.post('/budget/:budgetId/transactions', () => {
        res.send('POST Transactions')
    });
}