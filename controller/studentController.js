const {currentCourses, getGradesAndModulesForStudennt, getModules, getModulesOfAParticularStudent} = require('../data-access-layer/dbCalls.js'),
      passport = require('passport')
 


exports.index = function (req,res){
  res.render("studentView/index");
}

// ------------------------------------------------------------------------

exports.studentlogin = function(req, res){
  res.render("studentView/studentlogin");
}

// ------------------------------------------------------------------------


exports.dashboard = async function(req,res){
  let modulesInfo = [],
      modulesTotalInfo = [],
      searchStudentCourse = await currentCourses(req.user.username),
      searchGradesAndModules = await getGradesAndModulesForStudennt(searchStudentCourse._id)  
 
  for (let index = 0; index < searchGradesAndModules.length; index++) {
    modulesInfo.push(searchGradesAndModules[index]["module"])
  }
 
  for (let index = 0; index < modulesInfo.length; index++) {
    let moduleName = await getModules(modulesInfo[index])  
    modulesTotalInfo.push({"moduleName":moduleName["module_name"], "moduleCredits":moduleName["credits"]})
  }
  res.render("studentView/dashboard", {courseInfo:searchStudentCourse, gradeInfo:searchGradesAndModules, moduleInfo:modulesTotalInfo})
}


// ------------------------------------------------------------------------

exports.messages = function studentMessages(req,res){
  res.render("studentView/messages")
}


// ------------------------------------------------------------------------


exports.uploadGet = async function(req,res){

const query = await getModulesOfAParticularStudent(req.user.currentCourse[0]["course_name"])
console.log(req.body)
let moduleNames = query[0].modules

let mods = []
let modNames = []

for (let index = 0; index < moduleNames.length; index++) {
  const element = moduleNames[index].toString();
  mods.push(element)
}

for (const key in mods) {
 let query2 = await getModules(mods[key])
  modNames.push(query2.module_name)
}
  await res.render("studentView/upload", {mods:modNames} )
}


exports.settings = function(req,res){
  res.render("studentView/settings")
}

// ------------------------------------------------------------------------

exports.logout = function(req,res){
  req.session.destroy()
  res.redirect('studentlogin')
}

//POST REQUEST

exports.upload = function (req,res){
  if (req.file['mimetype']!=='application/pdf') {
    return res.status(400).send({ message: err.message})
  }
  res.redirect(301,"upload")
}

exports.checklogin = passport.authenticate('local', {
  successRedirect: '/studentIndex',
  failureRedirect: '/studentlogin'
})

