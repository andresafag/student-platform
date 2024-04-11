const fs = require('fs');
const path = require("path"); 


let file = path.join(__dirname, `../texto.txt`);

fs.readFile(file, 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data)
  });
