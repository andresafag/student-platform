const socket = io(),
      usersBox = document.createElement('ul'),
      usersConnectedBox = document.querySelector('#users-connected'),
      inputUsers = document.querySelector('#input-text'),
      msgBubble = document.querySelector('#msgBubble'),
      msgBox = document.querySelector('#showMsgs'),
      btnbrdcast = document.querySelector(".btnbrdcast"),
      notification = document.querySelector("#notification")
      
let counter = 0
const dayNames = ["Monday", "Tuesday", "wednesday", "Thursday", "Friday", "Saturday","Sunday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

//socket activates whenever any user either comes in or out passing the connected users array
socket.on('pass connected users', (userConnected)=> {
    //we empty the box with users coneonnected to render the new connected users
    usersConnectedBox.innerHTML = ""
    for (var i = 0; i < userConnected.length; i++) { 

        //For each user we create a li item
        usersConnectedBox.innerHTML += `<li class="selectUser font-info">${userConnected[i]["name"]}</li>`
    }
    //Once connected users are looped they get selected and the click event is added to every single one of them 
    let usrs = document.querySelectorAll('.selectUser')
    for (var i = 0; i < usrs.length; i++) {
        usrs[i].addEventListener('click', sendMsg)    
        usrs[i].addEventListener('click', showUserMsgIsSentTo)    
    }   
})

document.addEventListener('DOMContentLoaded', () => {
    const textareaEle = document.querySelector('.textarea');
    textareaEle.addEventListener('input', () => {
        textareaEle.style.height = 'auto';
        textareaEle.style.height = `${textareaEle.scrollHeight}px`;
    });
});


window.addEventListener("load", (event) => {
    socket.emit("message list collection")
  });

socket.on("user messages", (messagesList)=>{
    console.log(messagesList)
    if (messagesList.length > 0) {
        for (let index = 0; index < messagesList.length; index++) {
            const element = messagesList[index];
            let elementItem = element.split(":", 8)
            console.log("veamos que pasó " + elementItem[0])
            msgBox.innerHTML += `<div><b>${elementItem[0]}-${elementItem[1]}-${elementItem[2]}-${elementItem[3]} at ${elementItem[4]}:${elementItem[5]}</b></div><div><span><strong>${elementItem[6]}: </strong></span><span>${elementItem[7]}</span></div>`

          }
    }
})

function sendMsg () {
    //Here we emit the "sending msg to user" to the back-end     
    switch (inputUsers.value.length) {
        case 0:
            alert("no hay nada")
            break;
        default:
            socket.emit("sending msg to a particular user", this.innerText, inputUsers.value)
            inputUsers.value = ""
            break;
    }
}


function showUserMsgIsSentTo() {
    document.querySelector(".username").innerHTML = this.innerHTML
    setTimeout(() => {
        document.querySelector(".username").innerHTML = ''
    }, 3000);
}

//This is where the messages come from the back-end to the front-end 
socket.on('msg', (usr, msg)=>{ 
    msgBox.innerHTML += `<div><b>${new Date().getFullYear()}-${month[new Date().getMonth()]}-${new Date().getDate()}-${dayNames[new Date().getDay()]} at ${new Date().getHours()}:${new Date().getMinutes()}</b></div><div><span><strong>${usr}: </strong></span><span>${msg}</span></div>`

    
    if (msgBox.classList.contains("showIt") == true && notification.classList.contains("showIt")) {
        notification.classList.remove("showIt")
        counter+=1
        notification.innerHTML = `${counter}`  
    } else {
        counter = 0
        notification.textContent = ''
        notification.classList.add("showIt")
    }
})

msgBubble.addEventListener('click', () => {
    msgBox.classList.toggle("showIt")
    let scroll = msgBox.scrollHeight
    console.log(msgBox.scrollHeight)
    msgBox.scrollTop = scroll - 10 
    if (msgBox.classList.contains("showIt") == false) {
        notification.innerHTML = ''
        notification.classList.add("showIt")
    } else if(msgBox.classList.contains("showIt") == true) {
        notification.classList.remove("dissapear")
        console.log("vea")
    }
    
})

btnbrdcast.addEventListener("click", function(){
    switch (inputUsers.value.length) {
        case 0:
            alert("no hay nada")
            break;
        default:
            socket.emit("sending msg to all users", inputUsers.value)
            inputUsers.value = ""
            break;
    }

})


socket.on("message to everyone", (msg, sender)=>{
    msgBox.innerHTML += `<div><b>${new Date().getFullYear()}-${month[new Date().getMonth()]}-${new Date().getDate()}-${dayNames[new Date().getDay()]} at ${new Date().getHours()}:${new Date().getMinutes()}</b></div><div><span><strong>${sender}: </strong></span><span>${msg}</span></div>`
})



socket.on("msg to same sender", (msg)=>{
    msgBox.innerHTML += `<div><b>${new Date().getFullYear()}-${month[new Date().getMonth()]}-${new Date().getDate()}-${dayNames[new Date().getDay()]} at ${new Date().getHours()}:${new Date().getMinutes()}</b></div><div><span><strong>I: </strong></span><span>${msg}</span></div>`
})

window.onload = function name() {
    inputUsers.innerHTML = ""
}