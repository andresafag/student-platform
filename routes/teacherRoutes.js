const express = require('express'),
	  router = express.Router(),
	  {upload} = require('../services/multer.js'),
	  checkAuthenticationTeacher = require('../services/passport-users.js').checkAuthenticationTeacher,
	  teacherController = require('../controller/teacherController.js')


router.get('/teacherlogin', teacherController.teacherlogin)
.get('/teacherdashboard', checkAuthenticationTeacher, teacherController.dashboard)
.get('/teacherindex', checkAuthenticationTeacher,  teacherController.teacherindex)
.post('/getviewerdoc', checkAuthenticationTeacher,  teacherController.getviewerdoc)
.post('/getstudents', checkAuthenticationTeacher,  teacherController.getstudents)
.post('/getdocuments', checkAuthenticationTeacher,  teacherController.getdocuments)
.get('/teachermessages', checkAuthenticationTeacher, teacherController.messages)
.get('/teacherupload', checkAuthenticationTeacher,  teacherController.uploadGet)
.get('/teachersettings', checkAuthenticationTeacher,  teacherController.settings)
.post('/checkloginteacher', teacherController.checkloginteacher)
.post('/changegrades', checkAuthenticationTeacher, teacherController.changegrades)
.get('/teacherout', checkAuthenticationTeacher, teacherController.logout)

module.exports = router
