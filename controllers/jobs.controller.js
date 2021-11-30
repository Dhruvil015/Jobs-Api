const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const catchAsync  = require('../utils/catchAsync')
const Job = require('../models/Jobs.model')

const getAllJobs = catchAsync(async(req,res,next) => {
    const {userId} = req.user
    const jobs = await Job.find({createdBy : userId}).sort('-createdAt')
    if(!jobs){
        res.status(httpStatus.OK).send("you have no jobs to show.")
    }
    res.status(httpStatus.OK).json({jobs})
})

const getJob = catchAsync(async(req,res,next) => {
    const {id:jobId} = req.params
    const {userId} = req.user
    const job = await Job.findOne({_id : jobId, createdBy: userId})
    if(!job){
        throw new ApiError(httpStatus.NOT_FOUND, `No item found with id ${jobId}.`)
    }
    res.status(httpStatus.OK).json(job)
})

const createJob = catchAsync(async(req,res,next) => {
    const {userId} = req.user
    const {company, position} = req.body
    if(!company || !position){
        throw new ApiError(httpStatus.BAD_REQUEST, 'please provide company and position deatials.')
    }
    const job = await Job.create({
        company : company,
        position :  position,
        createdBy : userId,
    })
    res.status(httpStatus.CREATED).json({job})
})

const updateJob = catchAsync(async(req,res,next) => {
    const {userId} = req.user
    const {id:jobId} = req.params
    const {company, position, status} = req.body
    if(company == '' || position == '' || status== ''){
        throw new ApiError(httpStatus.BAD_REQUEST, 'company,position or status should not be empty.')
    }
    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId},req.body, {new:true, runValidators:true})
    if(!job){
        throw new ApiError(httpStatus.NOT_FOUND, `No item found with id ${jobId}.`)
    }
    res.status(httpStatus.OK).json(job)
})

const deleteJob = catchAsync(async(req,res,next) => {
    const {id:jobId} = req.params
    const {userId} = req.user
    const job = await Job.findOneAndDelete({_id:jobId, createdBy:userId})
    if(!job){
        throw new ApiError(httpStatus.NOT_FOUND, `No item found with id ${jobId}.`)
    }
    res.status(httpStatus.OK).send("Job deleted successfully.")
})


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    
}