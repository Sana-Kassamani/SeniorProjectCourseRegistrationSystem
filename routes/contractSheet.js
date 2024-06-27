const express = require('express')
const router = express.Router()
const path = require('path')
const contractSheetController=require(path.join(__dirname,'..','controllers','getMajorCourses'))



router.get('/', contractSheetController.getMajorCourses)


module.exports = router