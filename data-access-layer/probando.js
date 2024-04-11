getModules = require('../data-access-layer/dbCalls.js').getModules

async function testing (){
    var query = "651145ce026443fc20ae2836";
    let mod = await getModules(query)
    console.log(mod[0])
}

testing()