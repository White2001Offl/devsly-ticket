const Discord = require('discord.js');
const create = require('./channel');

var data = []

function pname(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Project Name**')
        .setDescription(`Please Specify Your Project Name`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function pdetails(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Project Details**')
        .setDescription(`Please Add your project details`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function fplink(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Forum Profile Link**')
        .setDescription(`Please Specify any of your forum profile link`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function budget(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Budget**')
        .setDescription(`Whats your Budget`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function pmethod(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Payment Method**')
        .setDescription(`Whats your payment method?`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function deadline(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Deadline**')
        .setDescription(`In how many days you need this project to be completed?`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function outoftime(){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setTitle('**Stopped**')
        .setDescription(`Interactive Setup Stopped`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function DM_Closed(id){
    return new Discord.MessageEmbed()
        .setColor('#28df99')
        .setDescription(`<@${id}> It Seems Your DMs are Closed. I can't Message you with that setting.`)
        .setTimestamp()
        .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}


async function interact(message,user){
    let filter = m => m.author.id === user.id
    try{

        // Project Name
        await user.send(pname()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[0] =`${collected.first().content}`
                
            })
        })

        // Project Details
        await user.send(pdetails()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[1] =`${collected.first().content}`
                
            })
        })

        // Forum profile Link
        await user.send(fplink()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[2] =`${collected.first().content}`
                
            })
        })

        // Budget
        await user.send(budget()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[3] =`${collected.first().content}`
                
            })
        })

        // Payment Method
        await user.send(pmethod()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[4] =`${collected.first().content}`
                
            })
        })

        // DeadLine
        await user.send(deadline()).then(async msg => {
            await msg.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                data[5] =`${collected.first().content}`
            })
        })
        
        create.channel(data,message,user)


    }
    catch(err){
        user.send(outoftime()).catch(err=>{
            return message.message.channel.send(DM_Closed(user.id)).then(m=>{
                m.delete({ timeout: 15000 })
            })
        })
    }
}

module.exports = { interact }