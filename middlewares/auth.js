const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')

const auth = async (req, res, next) => {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            reject(new ApiError(httpStatus.UNAUTHORIZED, 'please authenticate'))
        }
        const token = authHeader.split(' ')[1]
    
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = {userId : payload.id, name : payload.username}   
            resolve()
            
        }catch(error){
            reject( new ApiError(httpStatus.UNAUTHORIZED, 'please authenticate'))
        }
    }).then(() => next()).catch((err) => next(err))
}

module.exports = auth