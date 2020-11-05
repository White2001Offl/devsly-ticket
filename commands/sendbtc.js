const fetch = require('node-fetch')
const fs = require('fs')
const Discord = require('discord.js');
const { addy } = require('../changeaddy');

const options = {
    method: 'GET',
}

async function sendbtc(amount,callback){
    await fetch(`https://blockchain.info/tobtc?currency=USD&value=${amount}`,options)
    .then(res => res.json())
    .then(async json => {
        return await callback(json)
    })
}

function btcqr(address,amount){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`Scan this QR Code to Send BTC\n\nPlease pay to following adress \`\`\`${address}\`\`\`\nAmount \`\`\`${amount} BTC\`\`\``)
        .setImage(`https://chart.googleapis.com/chart?chs=225x225&chld=L|2&cht=qr&chl=bitcoin:${address}?amount=${amount}`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}
module.exports = {
	name: 'sendbtc',
	description: 'Generates a QR Code',
	cooldown: 3,
    guildOnly: true,
    args: true,
    usage: `<amount>`,
	async execute(message, args) {
        message.delete()
        addy((address)=>{
            sendbtc(args[0],(result)=>{
                let value = result
                return message.channel.send(btcqr(address,value))
            })
        })
    }
}