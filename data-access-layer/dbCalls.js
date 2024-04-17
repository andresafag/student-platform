const {Student, Course, Module, Teacher,Grade} = require('./models.js')

function currentCourses(student) {
      return Student.findOne({username:student})
      .populate("currentCourse")
}


function getGradesAndModules (moduleId) {
      return Grade.find({module:moduleId})
}

function getModuleId (module_name) {
      return Module.findOne({module_name:module_name})
}

function getGradesAndModulesForStudennt (studentId) {
      return Grade.find({student:studentId})
}


function getStudentId (studentUsername) {
      return Student.find({username:studentUsername})
}

function getStudentInfo (studentId) {
      return Student.findById({studentId})
}

function getModules (moduleId) {
      return Module.findById(moduleId)
}

function getStudentIdByStudentFullname (name,lastName) {
      return Student.find({name:name,lastName:lastName})
}


async function getModulesOfAParticularStudent(course){
      let getModulesArray = []
      let getModules = await Course.find({course_name:course})
      // for (let index = 0; index < getModules.length; index++) {
      //       const element = getModules[index];
      //       let moduleNames = await Module.find({element})
      //       getModulesArray.push(moduleNames[0].module_name)
      //     }

      return getModules
}



function getCourses(moduleId) {
      return Course.find({modules:moduleId})
}

function studentCourses() {
      return Student.find()
}

function findStudentByUserName(studentId) {
      return Student.findOne({username:studentId})
}

function setGrades(studentId,moduleName,grade,value) {
      return Grade.findOneAndUpdate({student:studentId,module:moduleName["_id"]},{[`${grade}`]:value}, {
                  new: true,
                  upsert: true,
                  rawResult: true // Return the raw result from the MongoDB driver
                })

}


function TeacherInfo(teacherUsername) {
      return Teacher.findOne({teacher_username:teacherUsername})
}

exports.currentCourses = currentCourses
exports.getGradesAndModules = getGradesAndModules
exports.getModules = getModules
exports.getCourses = getCourses
exports.studentCourses = studentCourses
exports.findStudentByUserName = findStudentByUserName
exports.setGrades = setGrades
exports.TeacherInfo = TeacherInfo
exports.getModulesOfAParticularStudent = getModulesOfAParticularStudent
exports.getStudentId = getStudentId
exports.getStudentInfo = getStudentInfo
exports.getGradesAndModulesForStudennt = getGradesAndModulesForStudennt
exports.getStudentIdByStudentFullname = getStudentIdByStudentFullname
exports.getModuleId = getModuleId
 