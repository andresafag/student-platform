const redis = require('redis')
const redisClient = redis.createClient()
redisClient.connect()

const dayNames = ["Monday", "Tuesday", "wednesday", "Thursday", "Friday", "Saturday","Sunday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];


async function  messagesCollections(usr) {
    let collectionOfMsgs = await redisClient.lRange(`msgstoragefor:${usr}:student`, 0, -1)
    return collectionOfMsgs
} 

function  pushMsgToAll(usrs, sameUser, msg) {

    for (let index = 0; index < usrs.length; index++) {
        if (sameUser == usrs[index]["name"]) {
            redisClient.rPush(`msgstoragefor:${usrs[index]["name"]}:student`, `${new Date().getFullYear()}:${month[new Date().getMonth()]}:${new Date().getDate()}:${dayNames[new Date().getDay()]}:${new Date().getHours()}:${new Date().getMinutes()}: I: ${msg}`);                 
        } else {

            redisClient.rPush(`msgstoragefor:${usrs[index]["name"]}:student`, `${new Date().getFullYear()}:${month[new Date().getMonth()]}:${new Date().getDate()}:${dayNames[new Date().getDay()]}:${new Date().getHours()}:${new Date().getMinutes()}:${sameUser}:${msg}`);     
        }
    }
} 

function pushMessages(usr, sender, msg) {
    redisClient.rPush(`msgstoragefor:${usr}:student`, `${new Date().getFullYear()}:${month[new Date().getMonth()]}:${new Date().getDate()}:${dayNames[new Date().getDay()]}:${new Date().getHours()}:${new Date().getMinutes()}:${sender}:${msg}`);    
}

exports.pushMessages = pushMessages
exports.messagesCollections = messagesCollections
exports.pushMsgToAll = pushMsgToAll