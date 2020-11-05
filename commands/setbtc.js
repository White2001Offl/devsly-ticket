const fs = require('fs')
const Discord = require('discord.js');
const addy = require('../changeaddy')

function success(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`Done ✅`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function noAdmin(id){
    return new Discord.MessageEmbed()
        .setColor('#ff4b5c')
        .setDescription(`<@${id}> You're not a Admin. You can't change address`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
	name: 'setbtc',
	description: 'Generates a QR Code',
	cooldown: 3,
    guildOnly: true,
    args: true,
    usage: `<address>`,
	async execute(message, args) {
        message.delete()
        if(message.member.hasPermission('ADMINISTRATOR')){
            addy.change(args[0],(result)=>{
                if(result){
                    return message.channel.send(success())
                }
            })
        }
        else{
            return message.channel.send(noAdmin(message.author.id))
        }
        
    }
}