let computerScience = []
let electricalEngineering = []

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.addStudentsToSpecificCourses = function(sck, usr){	
	(sck == "electrical engineering") ? 
  electricalEngineering.indexOf(usr) === -1 ? 
  electricalEngineering.push(usr) : console.log("error") : 
  sck == "computer science" ? 
  computerScience.indexOf(usr) === -1 ? 
  computerScience.push(usr) : 
  console.log("error") : 
  console.log("error")
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.sendMsg = function (usr, msg, sckUserName, sckCourse) {
	let filterelectricalEngineering = electricalEngineering.findIndex(
    function checkExistance(item){
    return item["name"] == usr
  })

  let filterComputerScience = computerScience.findIndex(
    function checkExistance(item){
    return item["name"] == usr
  })

  
  if (filterelectricalEngineering!= -1 && sckUserName != usr) {
      return electricalEngineering[filterelectricalEngineering]["sckId"]
    }

    if (filterComputerScience != -1 && sckUserName != usr) {
      return computerScience[filterComputerScience]["sckId"]
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.connectedUsers = function(courseName){
	
	switch (courseName) {
     case "computer science":
     	return computerScience
       break;
     case "electrical engineering":
     	return electricalEngineering
       break; 
     default:
      return;
       break;
   }

}
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

exports.disconnectedUsers = function(course,usr){
	switch (course) {
     case "computer science":
      computerScience.splice(computerScience.indexOf(usr), 1);
       return computerScience
       break;
     case "electrical engineering":
      electricalEngineering.splice(electricalEngineering.indexOf(usr), 1);
      return electricalEngineering
       break; 
     default:
      return;
       break;
   }

}




