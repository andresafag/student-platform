const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      {Student} = require('../data-access-layer/models.js'),
      {Teacher} = require('../data-access-layer/models.js'),
      serialize = require('./serializer.js').serialize,
      deserialize = require('./serializer.js').deserialize

let verifyUser = async (userName, passWd,cb)=>{    

    let res = await Student.findOne({username:userName, password:passWd})
    if (res == null ) {
        let res2 = await Teacher.findOne({teacher_username:userName, password:passWd})
        if (res2 != null && res2.role=="teacher") {
            cb(null,res2) 
        } else {
            cb(null,false)
        }
    } else  { 
        cb(null,res)
    }

    // let res = await Student.findOne({username:userName, password:passWd})
    // if (res != null ) {
    //         cb(null,res) 
    //     } else {
    //         cb(null,false)
    //     }

}

let strategy = new LocalStrategy(verifyUser);

serialize
deserialize

exports.checkAuthenticationStudent = function(req,res,next){
    if(req.isAuthenticated() && req.user.role == "student"){
        next();
    } else {
        res.redirect("/studentlogin");
    }   
}


exports.checkAuthenticationTeacher = function(req,res,next){
    if(req.isAuthenticated() && req.user.role == "teacher"){
        next();
    } else {
        res.redirect("/teacherlogin");
    }   
}


exports.localStrategy = strategy