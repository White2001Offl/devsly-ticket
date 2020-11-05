const Discord = require('discord.js')
const {supportRoles} = require('../config.json')
const roles = supportRoles.split(',')
const Mongo = require('../connect')

async function verifyRoles(message,roles,callback){
    var conf = 0
        for(role of roles){
            if(message.member.roles.cache.has(role)){
                conf = 1
            }
        }
        if(conf=1){
            return await callback(true)
        }
        else{
            return await callback(false)
        }
}

function updated(auID,chID){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> Updated Channel Name to <#${chID}>`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
    name: 'rename',
    description: 'Renames the Channel',
    cooldown: 3,
    guildOnly: true,
    args: true,
    usage: `<channelName>`,
    async execute(message, args) {
        message.delete()
        verifyRoles(message,roles,(role) => {
            if(role){
                Mongo.validateChannel(message.channel.id,(result)=>{
                    try{
                        if(result.channelID === message.channel.id){
                            message.channel.setName(args[0]).then(message.channel.send(updated(message.author.id,message.channel.id)).then(msg=>{
                                msg.delete({timeout: 15000})
                            }))
                        }
                    }
                    catch(err){

                    }
                })
            }
        })
    }
}