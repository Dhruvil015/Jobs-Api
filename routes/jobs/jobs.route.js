const express = require('express')
const router = express.Router()
const jobsController = require('../../controllers/jobs.controller')

router.get('/', jobsController.getAllJobs)

router.post('/', jobsController.createJob)

router.get('/:id', jobsController.getJob)

router.patch('/:id', jobsController.updateJob)

router.delete('/:id', jobsController.deleteJob)

module.exports = router