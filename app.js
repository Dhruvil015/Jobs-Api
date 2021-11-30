const express = require('express');
const app = express()
const connectDB = require('./db/connectDB')
const {errorConverter , errorHandler} = require('./middlewares/error')
const notFound = require('./middlewares/not-found')
require('dotenv').config({})
const routes = require('./routes/index') 

// extra security packages
const helmet =  require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

app.set('trust proxy', 1);
app.use(
    rateLimiter({
    windowMs:15*60*1000, // 15 minutes
    max:50, // limit each IP to 100 request per windowMs
})
);
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res)=> {
    res.send('jobs api')
})

//routes
app.use('/api/v1', routes)

//error handling
app.use(notFound)
app.use(errorConverter)
app.use(errorHandler)

const port = process.env.PORT || 3000

const start = async() => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server is running on ${port}...`))
    }catch(error){
        console.log(error)
    }
}

start()