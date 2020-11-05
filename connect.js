const MongoClient = require('mongodb').MongoClient;
const {mongodb,dbName} = require('./config.json')
var connection;

MongoClient.connect(mongodb, { useUnifiedTopology: true }, function(err, client) {
    if(err)throw err
    console.log("Connected successfully to server");
    connection = client
})

const updatePanel = function(msID){
    const db = connection.db(dbName)
    const collection = db.collection('panel')
    collection.insertOne(
        { 
            messageID: `${msID}`, 
        }, 
    async function(err, result) {
        if(err)throw err
    })
}

const validatePanel = function(msID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('panel')
    collection.findOne(
        {messageID: `${msID}`},
        async function(err,result){
            if(err)throw err
            return await callback(result)
        }
    )
}

const insertDocuments = function(chID,meID,auID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.insertOne(
        {
            channelID : `${chID}`, 
            messageID: `${meID}`, 
            authorID: `${auID}`,
            claim: 'none'
        }, 
    async function(err, result) {
        if(err)throw err
        await callback(result)
    })
}

const validateTicket = async function(auID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.findOne(
        {authorID: `${auID}`},
        async function(err,result){
            if(err)throw err
            return await callback(result)
        }
    )
}

const validateChannel = async function(chID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.findOne(
        {channelID: `${chID}`},
        async function(err,result){
            if(err)throw err
            
            return await callback(result)
        }
    )
}

const closeTicket = async function(auID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.updateOne(
        { authorID :  `${auID}`},
        { $set: { authorID : 'none' } }, 
        async function(err, result) {
            if(err)throw err
            return await callback(result)
        })
}

const deleteTicket = async function(chID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.deleteOne(
        {channelID: `${chID}`},
        async function(err,result){
            if(err)throw err
            return await callback(result)
        }
    )
}

const createClaim = async function(auID){
    const db = connection.db(dbName)
    const collection = db.collection('claims')
    const ticket = db.collection('tickets')
    collection.insertOne(
        {
            authorID: `${auID}`,
            count: "1",
        }, 
    async function(err, result) {
        if(err)throw err
    })

}

const updateClaim = async function(auID,count){
    const db = connection.db(dbName)
    const collection = db.collection('claims')
    const ticket = db.collection('tickets')
    let c = Number(count) + 1
    let c1 = c.toString()
    collection.updateOne(
        { authorID :  `${auID}`},
        { $set: { count : `${c1}` } }, 
        async function(err, result) {
            if(err)throw err
        })
    
}

const updateTicketsClaim = function(chID,auID){
    const db = connection.db(dbName)
    const ticket = db.collection('tickets')
    ticket.updateOne(
        { channelID :  `${chID}`},
        { $set: { claim : `${auID}` } }, 
        async function(err, result) {
            if(err)throw err
        })
}

const validateClaim = async function(auID,callback){
    const db = connection.db(dbName)
    const collection = db.collection('claims')
    collection.findOne(
        {authorID: `${auID}`},
        async function(err,result){
            if(err)throw err
            return await callback(result)
        }
    )
}

const removeClaimTicket = async function(chID){
    const db = connection.db(dbName)
    const ticket = db.collection('tickets')
    ticket.updateOne(
        { channelID :  `${chID}`},
        { $set: { claim : 'none' } }, 
        async function(err, result) {
            if(err)throw err
        })
}

const removeClaim = async function(auID,count){
    const db = connection.db(dbName)
    const collection = db.collection('claims')
    let c = Number(count) - 1
    let c1 = c.toString()
    collection.updateOne(
        { authorID :  `${auID}`},
        { $set: { count : `${c1}` } }, 
        async function(err, result) {
            if(err)throw err
        })

}

module.exports = { insertDocuments,validateTicket,validateChannel,closeTicket,deleteTicket,createClaim,updateClaim,validateClaim,updateTicketsClaim,removeClaim,removeClaimTicket,updatePanel,validatePanel }


