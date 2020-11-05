const Discord = require('discord.js');
const Mongo = require('../connect')
const delay = require('delay')

function noAdmin(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You're not a Admin. You can't Close Ticket`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function ticketDeletePopup(){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`This order will be deleted in 5 seconds`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
	name: 'delete',
	description: 'Deletes Order',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        if(message.member.hasPermission('ADMINISTRATOR')){
            Mongo.validateChannel(message.channel.id,async (result) =>{
                if(result.channelID === `${message.channel.id}`){
                    await message.channel.send(ticketDeletePopup()).then(async msg=>{
                        await delay(5000).then(m=>{
                            if(result.claim !== 'none'){
                                Mongo.validateClaim(result.claim,(result5)=> {
                                    Mongo.removeClaim(result.claim,result5.count)
                                })
                            }
                            Mongo.deleteTicket(message.channel.id,async (result)=> {
                                message.channel.delete().catch(err=>{
                                    throw err
                                })
                            })
                        })
                    })
                }
            })
        }
        else{
            message.channel.send(noAdmin(message.author.id))
        }
    }
}