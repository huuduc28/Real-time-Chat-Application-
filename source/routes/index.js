const express = require('express')
const router = express.Router()
const homeRouter = require('./home')
const accountRouter = require('./account')
router.get('/', homeRouter)
router.use('/account',accountRouter)
module.exports = router;
