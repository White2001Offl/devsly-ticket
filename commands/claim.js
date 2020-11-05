const Discord = require('discord.js');
const fs = require('fs');  
const Mongo = require('../connect')
const perms = require('../permission')

function excessClaims(auID){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`<@${auID}> You've 2 Claims, Unclaim one Order and Try again`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function successClaim(auID){
    return new Discord.MessageEmbed()
            .setColor('#28df99')
            .setDescription(`Your order will be handled by <@${auID}>`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function alreadyClaimed(auID,chID){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`<#${chID}> is already claimed by <@${auID}>\n Only Admin can change this claim `)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

function removeClaim(auID){
    return new Discord.MessageEmbed()
            .setColor('#ff4b5c')
            .setDescription(`Your Order will not be handled by <@${auID}>`)
            .setTimestamp()
            .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
}

async function claim(user,channel){
    Mongo.validateChannel(channel.id,(result)=> {
        if(result.claim === 'none'){
            Mongo.validateClaim(user.id,(result1)=>{
                if(result1 === null){
                    Mongo.createClaim(user.id)
                    Mongo.updateTicketsClaim(channel.id,user.id)
                    perms.permission(channel,user,'claim')
                    channel.send(successClaim(user.id))
                }
                else if(result1.authorID === user.id && Number(result1.count) < 2){
                    Mongo.updateClaim(user.id,result1.count)
                    Mongo.updateTicketsClaim(channel.id,user.id)
                    perms.permission(channel,user,'claim')
                    channel.send(successClaim(user.id))
                }
                else{
                    user.send(excessClaims(user.id))
                }
            }) 
        }
        else{
            if(result.claim === `${user.id}`){
                Mongo.validateClaim(user.id,(result3)=>{
                    Mongo.removeClaim(user.id,result3.count)
                    Mongo.removeClaimTicket(channel.id)
                    perms.permission(channel,user,'unclaim')
                    channel.send(removeClaim(user.id))
                })
            }
            else{
                user.send(alreadyClaimed(result.claim,channel.id))
            }
            
        }
    })
}

module.exports = { claim }