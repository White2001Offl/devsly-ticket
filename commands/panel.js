const Discord = require('discord.js');
const fs = require('fs')
const {prefix} = require('../config.json')
const Mongo = require('../connect')


module.exports = {
	name: 'panel',
	description: 'Creates a Panel',
	cooldown: 3,
    guildOnly: true,
	async execute(message, args) {
        message.delete()
        if(!message.member.hasPermission('ADMINISTRATOR')){
            function e_invalid (){
                return new Discord.MessageEmbed()
                    .setColor('#d40808')
                    .setDescription(`You're not a Admin`)
                    .setTimestamp()
                    .setFooter('White2001#0530');
                }
            
            return message.channel.send(e_invalid())
        }

        function e_invalid (){
            return new Discord.MessageEmbed()
                .setColor('#28df99')
                .setTitle('**Devsly Order Creation**')
                .setDescription(`Hi,\nWe're Excited to work with you.\nWrite \`$new\` to create your order \nAnd I'll meet you in your DM`)
                .setTimestamp()
                .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
        }
        message.channel.send(e_invalid()).then(async msg => {
            Mongo.updatePanel(msg.channel.id)
            console.log('Panel Created Successfully')
        }).catch(err=>{
            console.log(err)
        })
    }
}