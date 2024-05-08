const passport = require('passport')
const { getCourses, TeacherInfo, getGradesAndModules, getStudentIdByStudentFullname, studentCourses, setGrades, getModuleId } = require('../data-access-layer/dbCalls.js')
const fs = require('fs');
const path = require("path"); 



exports.teacherindex = function (req,res){
  res.render("teacherView/index");
}
// ------------------------------------------------------------------------
exports.teacherlogin = function (req,res){
  res.render("teacherView/teacherlogin");
}

// ------------------------------------------------------------------------

exports.dashboard = async function(req,res){
  let teaches = await TeacherInfo(req.user.teacher_username).populate("teaches")  
  let moduleStudentRelationship = []
  let relationStuCourses = []
  let coursesArray = req.user.teaches

  async function collectCourses(params) {
    let courseNames = []

     for (let index = 0; index < params.length; index++) {
      let getCourse = await getCourses(params[index])
       courseNames.includes(getCourse[0]["course_name"]) ? {} : courseNames.push(getCourse[0]["course_name"])
    
     }
    return courseNames
  }

  let collectCoursess = await collectCourses(coursesArray)
  let studentResults = await studentCourses()
  for (let index = 0; index < studentResults.length; index++) {
    collectCoursess.includes(studentResults[index].currentCourse[0]["course_name"]) ? relationStuCourses.push(
      {"name_student":studentResults[index].name,
      "course":studentResults[index].currentCourse[0]["course_name"], 
      "lastname_student":studentResults[index].lastName,
      "username":studentResults[index].username
      }
      ) : {} 
    }


  for (let index = 0; index < teaches["teaches"].length; index++) {
    let mods = await getGradesAndModules(teaches["teaches"][index]["_id"]).populate("student").populate("module")

    if (mods.length > 0) {
      for (let index = 0; index < mods.length; index++) {
        moduleStudentRelationship.push({
          name:mods[index]["student"]["name"],
          lastname: mods[index]["student"]["lastName"],
          module: mods[index]["module"]["module_name"],
          grade1:mods[index]["gradeExam1"],  
          grade2:mods[index]["gradeExam2"],
          grade3:mods[index]["gradeExam3"],
          gradePerformance1:mods[index]["gradePerformance1"],
          gradePerformance2:mods[index]["gradePerformance2"], 
          additionalGrades: mods[index]["additionalGrades"]
        }) 
      }
    }
  }
 

    res.render("teacherView/dashboard", {listStudents:relationStuCourses, gradesPerStudent:moduleStudentRelationship})

}

// ------------------------------------------------------------------------

exports.messages = function (req,res){
  res.render("teacherView/messages")
}

// ------------------------------------------------------------------------
exports.getdocuments = async function (req,res) {
  let teaches = await TeacherInfo(req.user.teacher_username).populate("teaches")

  // console.log(teaches["teaches"].length)

  let courseFolders = []
  let documents = []
  let file = path.join(__dirname, `../public/uploads/`);
  let filenames = fs.readdirSync(file); 
  
  filenames.forEach(file => { 
    console.log(file)
    courseFolders.push(file)
  });


  courseFolders.forEach(folders=>{
    fs.readdirSync(`${file}${folders}`).forEach(files=>{
      if (files==req.body.moduleSelection) {
         fs.readdirSync(`${file}${folders}/${files}`).forEach(userName=>{
          if (req.body.userSelection == userName) {
            fs.readdirSync(`${file}${folders}/${files}/${userName}`).forEach(nombre=>{
               documents.push(`${folders}-${files}-${userName}-${nombre}`)
            })
          }
        })
      }
    })
  })

  res.status(200).send(JSON.stringify({docByUsers:documents}));
}

// ------------------------------------------------------------------------

exports.getstudents = function (req,res){
  let courseFolders = []
  let users = []
  let file = path.join(__dirname, `../public/uploads/`);
  let filenames = fs.readdirSync(file); 
  
  console.log("valor a pasar " + req.body.valueModule)

  filenames.forEach(file => { 
    courseFolders.push(file)
  });


  courseFolders.forEach(folders=>{
    fs.readdirSync(`${file}${folders}`).forEach(files=>{
      if (files==req.body.valueModule) {
        fs.readdirSync(`${file}${folders}/${files}`).forEach(student=>{
          users.push(student)
        })
      }
    })
  })

  res.status(200).send(JSON.stringify({reply:users}));
}

//----------------------------------------------------------------------

exports.uploadGet = async function(req,res){
  let teacherModules = await TeacherInfo(req.user.teacher_username).populate("teaches")  
    let moduleFolder = []  
    let courseFolders = []


  for (let index = 0; index < teacherModules["teaches"].length; index++) {
    // console.log(teacherModules["teaches"][index]["module_name"]) 
    moduleFolder.push(teacherModules["teaches"][index]["module_name"])
  }



//----------------------------------------------------------------------

  res.render("teacherView/upload", {folders:moduleFolder})
 }

//----------------------------------------------------------------------


exports.settings = function(req,res){
  res.render("teacherView/settings")
}

//----------------------------------------------------------------------


exports.logout = function(req,res){
  req.session.destroy()
  res.redirect('teacherlogin')
}

//POST REQUEST
exports.upload = function (req,res){
 res.send("upload")
}

exports.checkloginteacher = passport.authenticate('local', {
  successRedirect: '/teacherindex',
  failureRedirect: '/teacherlogin'
})

//----------------------------------------------------------------------

exports.changegrades = async function (req,res){
    let fullName = Object.keys(req.body)[0].split("_")
    let result = await getStudentIdByStudentFullname(fullName[0],fullName[1])
 
    Object.keys(req.body).forEach(async (key) => {
      const value = req.body[key];
      if (key.includes("grade") || key.includes("performance" )) {
        let grade = key.split("_")[0]
        let moduleName = await getModuleId(key.split("_")[1]) 
        let valueOfGrade = value
        await setGrades(result[0]["_id"],moduleName,grade,valueOfGrade)
      }
  });
 
  await res.send("Successfully sent")
}




