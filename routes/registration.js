const express = require('express')
const router = express.Router()
const path = require('path')
const geneticAlgo =require(path.join(__dirname,'..','controllers','geneticController'))



router.get('/', geneticAlgo.recommendCourses)


module.exports = router