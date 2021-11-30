const express = require('express')
const auth = require('../middlewares/auth')
const authRoutes =  require('./auth/auth.route')
const jobsRoutes = require('./jobs/jobs.route')


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/jobs',auth,jobsRoutes)

module.exports = router