require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const notFoundMiddleWare = require('./middlewares/not-found')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-route')
const depositRoute = require('./routes/deposit-route')
const transactionRoute = require('./routes/transaction-route')
const adminRoute = require('./routes/admin-route')


const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/auth', authRoute)
app.use('/deposit', depositRoute)
app.use('/transaction', transactionRoute)
app.use('/admin', adminRoute)

app.use(notFoundMiddleWare)
app.use(errorMiddleware)





const PORT = process.env.PORT || '5000'
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))