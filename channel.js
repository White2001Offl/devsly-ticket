const Discord = require('discord.js');
const fs = require('fs');
const Mongo = require('./connect')

function created(channel){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Order Created**')
        .setDescription(`Order created Successfully\nCheck your order here <#${channel.id}>`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function ticketMessage(data){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Order Details**')
        .setDescription(`**Project Name** - \`${data[0]}\`\n**Project  Details** - \`${data[1]}\`\n**Forum Profile Link** - \`${data[2]}\`\n**Budget** - \`${data[3]}\`\n**Payment Method** - \`${data[4]}\`\n**DeadLine** - \`${data[5]}\``)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function updateCount(json){
    let count = Number(json.count)
    count = count + 1
    json.count = count
    fs.writeFile("./config.json", JSON.stringify(json), err => { 
        if (err) throw err;  
    });
}

async function channel(data,message,user){
    fs.readFile('./config.json', async (err,data1) => {
        if(err) throw err;
        json = JSON.parse(data1)
        const roles = json.supportRoles.split(',')

        await message.guild.channels.create(`Order-${json.count}`, {
            type: 'text', 
            parent: `${json.category}`,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: user.id,
                    allow: ['VIEW_CHANNEL'],
                },
            ],
        }).then(async ch => {
            for(let role of roles){
                ch.updateOverwrite(role, { VIEW_CHANNEL: true})
            }
            
            ch.send(`<@${user.id}> If you want you can add your note here.`)
            ch.send(ticketMessage(data)).then(async msg => {
                Mongo.insertDocuments(ch.id,msg.id,user.id,(result)=> {
                })
            })
            user.send(created(ch))
            updateCount(json)
        })
    })
}

module.exports = { channel }