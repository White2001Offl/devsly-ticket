const Discord = require('discord.js');
const {supportRoles} = require('./config.json')
roles = supportRoles.split(',')

async function permission(channel,user,action){

    if(action === 'claim'){
        for(let role of roles){
            channel.updateOverwrite(role, { SEND_MESSAGES: false})
        }
        channel.updateOverwrite(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true})
    }
    else if(action === 'unclaim'){
        for(let role of roles){
            channel.updateOverwrite(role, { VIEW_CHANNEL: true, SEND_MESSAGES: true})
        }
        channel.permissionOverwrites.get(user.id).delete();
    }
}

module.exports = { permission }