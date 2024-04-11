const mongoose  = require('mongoose');
mongoose.set('strictQuery', false)


// STUDENT SCHEMA
let studentSchema = new mongoose.Schema({
  name:{type:String, trim:true, minLength:[4, "not allowed"]},
  lastName:{type:String, trim:true, minLength:[4, "not allowed"]},
  username:{type:String, trim:true, minLength:[4, "not allowed"]},
  password:{type:String, minLength:[6, "not allowed"]},
  isActive:{type:Boolean},
  role:String,
  currentCourse:[{course_name:String, creditsSoFar:Number}]
})


// COURSE SCHEMA
let courseSchema = new mongoose.Schema({
  course_name:{type:String, require:true, trim:true, minLength:[4, "not allowed"]},
  total_credits:{type:Number, require:true},
  description:{type:String, trim:true, minLength:[4, "not allowed"]},
  current_students:[{type:mongoose.Schema.Types.ObjectId, ref: 'Student'}],
  modules: [{type:mongoose.Schema.Types.ObjectId, ref: 'Module'}],
}) 

// TEACHER SCHEMA
let teacherSchema = new mongoose.Schema({
  teacher_username: {type:String, require:true, trim:true, minLength:[4, "not allowed"]},
  password: {type:String, trim:true, minLength:[4, "not allowed"]},
  teacher_name:{type:String, require:true, trim:true, minLength:[4, "not allowed"]},
  role:String,
  teaches:[{type:mongoose.Schema.Types.ObjectId, ref: 'Module'}],
})

// MODULE SCHEMA
let moduleSchema = new mongoose.Schema({
  module_name:{type:String, trim:true, minLength:[4, "not allowed"]},
  credits:{type:Number},
  description:{type:String, trim:true, minLength:[4, "not allowed"]},
})

// GRADES SCHEMA
let gradeSchema = new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId, ref:'Student'},
  module:{type:mongoose.Schema.Types.ObjectId, ref:'Module'},
  gradeExam1:Number,
  gradeExam2:Number,
  gradeExam3:Number,
  gradePerformance1:Number,
  gradePerformance2:Number,
  additionalGrades:[Number],
})


// db.grades.insertOne({})
const Student = mongoose.model('Student', studentSchema)
const Course = mongoose.model('Course', courseSchema)
const Teacher = mongoose.model('Teacher', teacherSchema)
const Module = mongoose.model('Module', moduleSchema)
const Grade = mongoose.model('Grade', gradeSchema)



exports.Student = Student
exports.Course = Course
exports.Teacher = Teacher
exports.Module = Module
exports.Grade = Grade


