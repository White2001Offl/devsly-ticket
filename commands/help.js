const Discord = require('discord.js')
const {prefix} = require('../config.json')

function help(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('Devsly.org Ticket Help')
        .addField(`${prefix}guide`,`\`Shows Help menu\``,false)
        .addField(`${prefix}panel`,`\`Creates A Panel, To Open Ticket(Note - It replaces your previous panel with newer one. So the previous panel will be useless)\``,false)
        .addField(`${prefix}close`,`\`Closes the order\``,false)
        .addField(`${prefix}new`,`\`Opens the order\``,false)
        .addField(`${prefix}claim`,`\`Helps to Claim the particular Order(Note - To Unclaim to claim command. It'll unclaim)\``,false)
        .addField(`${prefix}unclaim`,`\`Helps to UnClaim the particular Order(Only Admins Can do that)\``,false)
        .addField(`${prefix}delete`,`\`Deletes the Order\``,false)
        .addField(`${prefix}rename <ChannelName>`,`\`Renames Channel Name to which you specified\``,false)
        .addField(`${prefix}sendbtc <amount>`,`\`Sends a Beautiful Embed to send btc details\``,false)
        .addField(`${prefix}setbtc <address>`,`\`Changes your BTC address to your new one(Only Admins Can do that)\``,false)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

module.exports = {
    name: 'guide',
    description: 'Help Menu',
    cooldown: 3,
    guildOnly: true,
    async execute(message, args) {
        return message.channel.send(help())

    }
}