const express = require('express')
const app = express()
const router = express.Router();
const port = 8080

// Use our controllers
require('./controllers/budgetController')(router)
require('./controllers/transactionController')(router)

app.use(router)
app.get('/', (req, res) => {
    res.send('Main')
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))