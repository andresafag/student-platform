const express = require('express'),
	  router = express.Router(),
	  generalController = require('../controller/generalController.js')

router.get('/', generalController.welcome)


module.exports = router