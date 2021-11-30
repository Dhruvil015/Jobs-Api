const httpStatus = require('http-status')
const catchAsync  = require('../utils/catchAsync')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const bcrypt = require('bcryptjs')

const register = catchAsync(async(req, res, next) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(httpStatus.CREATED).json({user : {name : user.name}, token })
})

const login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new ApiError(httpStatus.BAD_REQUEST, 'please provide email and password.')
    }
    const user = await User.findOne({email : email})
    if(!user){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Credinital')
    }
    const isPasswordCorrect = await user.checkPassword(password)
    if (!isPasswordCorrect){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Credinital')
    }
    const token = user.createJWT()
    res.status(httpStatus.OK).send({user : {name : user.name}, token})
})


module.exports = {
    register,
    login,
}