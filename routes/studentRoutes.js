const express = require('express'),
			router = express.Router(),
			{upload} = require('../services/multer.js'),
			checkAuthentication = require('../services/passport-users.js').checkAuthenticationStudent,
			studentController = require('../controller/studentController.js')

router.get('/studentIndex', checkAuthentication, studentController.index)
.get('/studentlogin', studentController.studentlogin)
.get('/dashboard', checkAuthentication, studentController.dashboard)
.get('/messages', checkAuthentication, studentController.messages)
.get('/upload', checkAuthentication, studentController.uploadGet)
.get('/settings', checkAuthentication, studentController.settings)
.post('/download', checkAuthentication, upload.single('uploadFile'), studentController.upload)
.post('/checkLogin', studentController.checklogin)
.get('/out', checkAuthentication, studentController.logout);

module.exports = router


