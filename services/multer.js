let Multer = require('multer');
const fs = require("fs"); 
const path = require("path"); 



const fileFilter = (req, file, cb) => {
    const whitelist = [
      // 'image/png',
      // 'image/jpeg',
      // 'image/jpg',
      // 'image/jpg',
      'application/pdf',
      // 'application/xml'
    ]

    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'))
    } else {
        cb(null, false);
    }
    cb(null, true)
}

const storage = Multer.diskStorage({
  destination: function (req, file, cb) {

    let course = req.user.currentCourse[0]["course_name"].split(" ").join("")
    let name = req.user.name
    let lastName = req.user.lastName.toLowerCase()
    let mods = req.body["mods"]

    if (!fs.existsSync(`./uploads/${course}/`)) {
      fs.mkdirSync(path.join(__dirname, `../uploads/${course}/`));  
    } 
 
    if (!fs.existsSync(`./uploads/${course}/${mods}/`)) {
      fs.mkdirSync(path.join(__dirname, `../uploads/${course}/${mods}/`));
    }
    
    if (!fs.existsSync(`./uploads/${course}/${mods}/${name}-${lastName}/`)) {
      fs.mkdirSync(path.join(__dirname, `../uploads/${course}/${mods}/${name}-${lastName}/`));
    }
    
    cb(null, `./uploads/${course}/${mods}/${name}-${lastName}/`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${req.body["title"]}-${req.body["reason"]}-${uniqueSuffix}.pdf`)
  }
})

exports.upload = Multer({storage:storage, fileFilter:fileFilter}) 