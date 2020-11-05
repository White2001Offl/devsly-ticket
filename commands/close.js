const Discord = require('discord.js');
const Mongo = require('../connect')

function noAdmin(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You're not a Admin. You can't Close Ticket`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function ticketClosed(auID){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`Order Closed by <@${auID}>`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
	name: 'close',
	description: 'Closes Order',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        Mongo.validateChannel(message.channel.id,(result)=>{
            if(result.channelID === `${message.channel.id}`){
                if(message.member.hasPermission('ADMINISTRATOR')){
                    if(result.authorID !== 'none'){
                        let collection = message.channel.permissionOverwrites
                        let collect = collection.array()
                        for(list of collect){
                            if(list.type === 'member'){
                                message.channel.permissionOverwrites.get(list.id).delete();
                            }
                        }
                        Mongo.closeTicket(result.authorID,async (result)=> {
                            message.channel.send(ticketClosed(message.author.id))
                        })
                    }
                }
                else{
                    message.channel.send(noAdmin(message.author.id))
                }
            }
        })
    }
}