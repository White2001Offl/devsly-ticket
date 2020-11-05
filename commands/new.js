const Discord = require('discord.js');
const fs = require('fs')
const {prefix} = require('../config.json')
const Mongo = require('../connect')
const setup = require('../interactive')

function invalidPanel(id){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`<@${id}> You can't open order here`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function DM_Check(auID){
    return new Discord.MessageEmbed()
            .setColor('#28df99')
            .setDescription(`Pleas check your DM<@${auID}>`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}
function SpamTicket(auID,chID){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
	name: 'new',
	description: 'Creates new order',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        Mongo.validatePanel(message.channel.id,async (result) => {
            try{
                if(result){
                    Mongo.validateTicket(message.author.id,(result)=>{
                        try{
                            if(result.authorID === `${message.author.id}`){
                                message.author.send(SpamTicket(message.author.id,result.channelID))
                            }
                        }
                        catch(err){
                            console.log(err)
                            setup.interact(message,message.author)
                        }
                    })
                    message.channel.send(DM_Check(message.author.id)).then(msg => {
                        msg.delete({ timeout: 15000 })
                    })
                }
                else{
                    return message.channel.send(invalidPanel(message.author.id)).then(msg=>msg.delete({ timeout: 15000}))
                }
            }
            catch(err){
                console.log(err)
            }
        })
    }
}