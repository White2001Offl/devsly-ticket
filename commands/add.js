const Discord = require('discord.js');
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

function noArgs(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You didn't specified any argument`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function noPerms(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You don't have permission to do that`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function userAdded(id){
    return new Discord.MessageEmbed()
            .setColor('#28df99')
            .setDescription(`<@${id}> Added to the order`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
	name: 'add',
	description: 'Adds a user to order',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        var auID;
        verifyRoles(message,roles,(result)=> {
            if(result){
                if(message.mentions.users.size){
                    const ID1 = message.mentions.users.first();
                        auID = ID1.id
                }
                else if(args[0]){
                    auID = args[0]
                }
                else{
                    return message.channel.send(noArgs(message.author.id))
                }

                Mongo.validateChannel(message.channel.id,async (result) =>{
                    try{
                        if(result.channelID === `${message.channel.id}`){
                            message.channel.updateOverwrite(auID, { VIEW_CHANNEL: true, SEND_MESSAGES: true}).then(message.channel.send(userAdded(auID)))
                        }
                    }
                    catch(err){

                    }
                })
            }
            else{
                return message.author.send(noPerms(message.author.id))
            }
        })
        
    }
}