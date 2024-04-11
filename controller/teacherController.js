const passport = require('passport')
const { getModules, getGradesAndModules, getStudentId,getStudentInfo } = require('../data-access-layer/dbCalls.js')
const getCourses = require('../data-access-layer/dbCalls.js').getCourses
const studentCourses = require('../data-access-layer/dbCalls.js').studentCourses
const findStudentByUserName = require('../data-access-layer/dbCalls.js').findStudentByUserName
const setGrades = require('../data-access-layer/dbCalls.js').setGrades
const TeacherInfo = require('../data-access-layer/dbCalls.js').TeacherInfo 
const studentId = require('../data-access-layer/dbCalls.js').getStudentId
const fs = require('fs');
const path = require("path"); 
const { name } = require('ejs')


exports.teacherindex = function (req,res){
  res.render("teacherView/index");
}

exports.teacherlogin = function (req,res){
  res.render("teacherView/teacherlogin");
}

exports.viewer = function (req,res){
  res.render("teacherView/viewer");
}

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
  console.log(relationStuCourses)
  console.log(moduleStudentRelationshiprelationStuCourses)

    res.render("teacherView/dashboard" )//, {listStudents:relationStuCourses})

}




exports.messages = function (req,res){
  res.render("teacherView/messages")
}


exports.getdocuments = function (req,res) {
  let courseFolders = []
  let documents = []
  let file = path.join(__dirname, `../uploads/`);
  let filenames = fs.readdirSync(file); 
  
  filenames.forEach(file => { 
    courseFolders.push(file)
  });


  courseFolders.forEach(folders=>{
    fs.readdirSync(`${file}${folders}`).forEach(files=>{
      if (files==req.body.moduleSelection) {
        // console.log(files)
        fs.readdirSync(`${file}${folders}/${files}`).forEach(userName=>{
          if (req.body.userSelection == userName) {
            fs.readdirSync(`${file}${folders}/${files}/${userName}`).forEach(nombre=>{
              // console.log(nombre)
              documents.push(nombre)
            })
          }
        })
      }
    })
  })

  console.log(documents)
  res.status(200).send(JSON.stringify({docByUsers:documents}));
}




exports.getstudents = function (req,res){
  let courseFolders = []
  let users = []
  let file = path.join(__dirname, `../uploads/`);
  let filenames = fs.readdirSync(file); 
  
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

  console.log(users)


  res.status(200).send(JSON.stringify({reply:users}));
}


exports.uploadGet = async function(req,res){
  let teacherModules = await TeacherInfo(req.user.teacher_username).populate("teaches")  
    let moduleFolder = []  
    let courseFolders = []


  for (let index = 0; index < teacherModules["teaches"].length; index++) {
    // console.log(teacherModules["teaches"][index]["module_name"]) 
    moduleFolder.push(teacherModules["teaches"][index]["module_name"])
  }

  // let file = path.join(__dirname, `../uploads/`); 
  // let filenames = fs.readdirSync(file); 
  
  // filenames.forEach(file => { 
  //   courseFolders.push(file)
  // });




  
  // courseFolders.forEach(folder=>{
    // let folders = fs.readdirSync(`${file}${folder}`)
    // // moduleFolder = folders
    // console.log(folders)
    // for (let index = 0; index < moduleFolder.length; index++) {
    //   console.log("esta es la carpeta " + moduleFolder)
      
    // }


  // })


  res.render("teacherView/upload", {folders:moduleFolder})
  // res.send("hey")
}


exports.settings = function(req,res){
  res.render("teacherView/settings")
}

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

exports.changegrades = async function (req,res){
    console.log(req.body)
    let student = ""
    for (let index = 0; index < req.body.studentChosen.length; index++) {
      req.body.studentChosen[index].length > 0 ? student=req.body.studentChosen[index] :  {} 
    }
    console.log(student)



  
  // Below we catch the student's id
  // let chosen = await findStudentByUserName(req.body.studentChosen)
  // // Here we get the modules the teacher teaches
  // let teacherInfo = await TeacherInfo(req.user.teacher_username)
  // let teacherModules = []
  
  // teacherInfo.teaches.forEach(element => {
  //   teacherModules.push(element)           
  // });

  // console.log("this is the course the student is enrolled in: ",chosen["currentCourse"][0].course_name)
  // console.log("this is the student username: ", chosen["username"])
  // console.log("this is the student id: ", chosen["_id"])
  // console.log("These are the teacher modules: " + teacherModules)

  // Now we look for a match between the student's id and any of the modules this teacher teaches
  // for (let index = 0; index < teacherModules.length; index++) {
  //   let calificaciones = await setGrades(
  //     chosen["_id"], 
  //     teacherModules[index], 
  //     req.body.grade1[index], 
  //     req.body.grade2[index], 
  //     req.body.grade3[index], 
  //     req.body.gradeper1[index], 
  //     req.body.gradeper2[index], 
  //     req.body.gradeper3[index],
  //     req.body.additionalGrades 
  //     )     
  // }
 
  // console.log(calificaciones["lastErrorObject"]["updatedExisting"])
  // console.log(calificaciones) 
  // await res.send("Successfully sent")
  res.send("hello")
}




