const fs = require('fs')

async function change(address,callback){
    fs.readFile('./config.json', async (err,data) => {
        if(err)throw err
        json = JSON.parse(data)
        json.address = address
        fs.writeFile('./config.json', JSON.stringify(json), async err => {
            if(err) return await callback(false)
            return await callback(true)
        })
    })
}

async function addy(callback){
    fs.readFile('./config.json', async (err,data) => {
        if(err)throw err
        json = JSON.parse(data)
        return await callback(json.address)
    })
}

module.exports = { change,addy }