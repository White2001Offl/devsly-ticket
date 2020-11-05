const Discord = require('discord.js');
const fs = require('fs')
const {prefix} = require('../config.json')
const Mongo = require('../connect')
const perms = require('../permission')

function notEligible(){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`You need to be administrator to do that`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function notClaimed(){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`No one Claimed this order yet.`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function removeClaimAdmin(auID){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`Admin Resets - Your Order will not be handled by <@${auID}>`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}


module.exports = {
	name: 'unclaim',
	description: 'Unclaims the user from an order',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        if(!message.member.hasPermission('ADMINISTRATOR')){
            return message.author.send(notEligible())
        }
        else{
            Mongo.validateChannel(message.channel.id,(results)=>{
                if(results.claim === 'none'){
                   return message.author.send(notClaimed())
                }
                else{
                    let auID = results.claim
                    Mongo.validateClaim(auID,(result)=> {
                        let c = result.count
                        Mongo.removeClaim(auID,c)
                        Mongo.removeClaimTicket(message.channel.id)
                        perms.permission(message.channel,message.author,'unclaim')
                        return message.channel.send(removeClaimAdmin(auID))
                    })
                }
            })
        }
    }
}