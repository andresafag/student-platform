const passport = require('passport')

exports.serialize = passport.serializeUser(function(user, cb) {
	console.log("serializado")
    cb(null,user);
});

exports.deserialize = passport.deserializeUser(function(userId, cb) { 		
	console.log("deserializado")
	cb(null,userId)
});


