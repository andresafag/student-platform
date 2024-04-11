const currentCourses = require('../data-access-layer/dbCalls.js').currentCourses,
      getGradesAndModules = require('../data-access-layer/dbCalls.js').getGradesAndModules,
      getModules = require('../data-access-layer/dbCalls.js').getModules,
      getModulesOfAParticularStudent = require('../data-access-layer/dbCalls.js').getModulesOfAParticularStudent,
      passport = require('passport'),
      query = require('mongoose').Query



exports.index = function (req,res){
  res.render("studentView/index");
}

exports.studentlogin = function(req, res){
  res.render("studentView/studentlogin");
}

exports.dashboard = async function(req,res){
  let modulesInfo = [],
      modulesTotalInfo = [],
      searchStudentCourse = await currentCourses(req.user.username),
      searchGradesAndModules = await getGradesAndModules(searchStudentCourse._id)  
  
  //Aqui recolectamos los creditos del curso y el nombre
  // console.log(searchStudentCourse["currentCourse"][0]["course_name"] + " " + searchStudentCourse["currentCourse"][0]["creditsSoFar"])

  //Aqui recolectamos los ids de los modulos cursados
  for (let index = 0; index < searchGradesAndModules.length; index++) {
    // console.log("y la info del estudiante es: " + searchGradesAndModules[index])
    modulesInfo.push(searchGradesAndModules[index]["module"])
  }
  // console.log("los id de los modulos son: " + modulesInfo)

  //Aqui recolectamos los nombres de los modulos y sus creditos
  for (let index = 0; index < modulesInfo.length; index++) {
    let moduleName = await getModules(modulesInfo[index])  
    // console.log(`module name: ${moduleName[0]}`)
    // console.log(`module credits: ${moduleName[0]["credits"]}`)
    modulesTotalInfo.push({"moduleName":moduleName[0]["module_name"], "moduleCredits":moduleName[0]["credits"]})
  }

  console.log(searchGradesAndModules)

  res.render("studentView/dashboard", {courseInfo:searchStudentCourse, gradeInfo:searchGradesAndModules, moduleInfo:modulesTotalInfo})
  // res.send("dash")
}

exports.messages = function studentMessages(req,res){
  res.render("studentView/messages")
}




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

