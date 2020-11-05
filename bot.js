const fs = require('fs');  //To read files
const Discord = require('discord.js');    //To access Discord API  //Accessing Track.js File to Automate Stats Data through a Function
const { prefix, token } = require('./config.json'); // storing Prefix and Token
const setup = require('./interactive')
const Mongo = require('./connect')
const ticket = require('./commands/close')
const delay = require('delay')
const claim = require('./commands/claim')

const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }); // Creating a new Client
client.commands = new Discord.Collection(); // Accessing commands collection

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Reding command files

/*Storing commands in a accessible manner*/
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection(); // Cooldowns collection

/*Invokes When BOT is ready to do tasks*/ 
client.once('ready', () => {
    console.log('OK')
    console.log('Tickets Manager is Ready!');
});

// client.on('messageReactionAdd', async function(messageReaction, user){
//     console.log(user)
//     function DM_Check(id){
//         return new Discord.MessageEmbed()
//             .setColor('#28df99')
//             .setDescription(`<@${id}> Please check your DM`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }

//     function SpamTicket(auID,chID){
//         return new Discord.MessageEmbed()
//             .setColor('#28df99')
//             .setDescription(`<@${auID}> You've Already a Ticket opened at <#${chID}>`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }

//     function ticketClosed(auID){
//         return new Discord.MessageEmbed()
//             .setColor('#28df99')
//             .setDescription(`Order Closed by <@${auID}>`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }

//     function ticketDeletePopup(){
//         return new Discord.MessageEmbed()
//             .setColor('#ff4b5c')
//             .setDescription(`This order will be deleted in 5 seconds`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }

//     function noClaim(){
//         return new Discord.MessageEmbed()
//             .setColor('#ff4b5c')
//             .setDescription(`You Can't Claim!!`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }

//     function noAdmin(id){
//         return new Discord.MessageEmbed()
//             .setColor('#ff4b5c')
//             .setDescription(`<@${id}> You're not a Admin. You can't Close Ticket`)
//             .setTimestamp()
//             .setFooter('Devsly','https://cdn.discordapp.com/icons/748911349039628358/dbf44d41882b939fa6e12c77485513f2.webp?size=32');
//     }


//     if (messageReaction.partial) {
// 		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
// 		try {
// 			await messageReaction.fetch();
// 		} catch (error) {
// 			console.log('Something went wrong when fetching the message: ', error);
// 			// Return as `reaction.message.author` may be undefined/null
// 			return;
// 		}
//     }
    
//     fs.readFile('./config.json', async (err,data) => {

//         if(err) throw err;
//         json = JSON.parse(data)
//         if(messageReaction.emoji.name === '🎟️' && !user.bot){
//             Mongo.validatePanel(messageReaction.message.id,async (result) => {
//                 try{
//                     if(result){
//                         await messageReaction.users.remove(user.id)
//                         Mongo.validateTicket(user.id,(result)=>{
//                             try{
//                                 if(result.authorID === `${user.id}`){
//                                     user.send(SpamTicket(user.id,result.channelID))
//                                 }
//                             }
//                             catch(err){
//                                 setup.interact(messageReaction,user)
//                             }
//                         })
//                         messageReaction.message.channel.send(DM_Check(user.id)).then(msg => {
//                             msg.delete({ timeout: 15000 })
//                         })
//                     }
//                 }
//                 catch(err){
//                 }
//             })
//         }

//         else if(messageReaction.emoji.name === '🔒' && !user.bot){
//             Mongo.validateChannel(messageReaction.message.channel.id,async (result) =>{
//                 try{
//                     if(result.channelID === `${messageReaction.message.channel.id}` && result.authorID !== 'none'){
                        
//                         await messageReaction.users.remove(user.id)

//                         let member_list = messageReaction.message.channel.guild.members.cache.array()
//                         for (member of member_list){
//                             if(member.user.id === user.id){
//                                 if(member.hasPermission('ADMINISTRATOR')){
//                                     ///////////////// Removes the members who are added differently / author ///////////////////////
//                                     let collection = messageReaction.message.channel.permissionOverwrites
//                                     let collect = collection.array()
//                                     for(list of collect){
//                                         if(list.type === 'member'){
//                                             messageReaction.message.channel.permissionOverwrites.get(list.id).delete();
//                                         }
//                                     }
//                                     Mongo.closeTicket(result.authorID,async (result)=> {
//                                         messageReaction.message.channel.send(ticketClosed(user.id))
//                                     })
//                                     ////////////////////////////////////////////////////////////////////////////////////////////////
//                                 }
//                                 else{
//                                     messageReaction.message.channel.send(noAdmin(user.id))
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 catch(err){
//                     console.log(err)
//                 }
//             })
//         }

//         else if(messageReaction.emoji.name === '📌' && !user.bot){
//             Mongo.validateChannel(messageReaction.message.channel.id,async (result) =>{
//                 try{
//                     if(result.channelID === `${messageReaction.message.channel.id}`){
//                         if(result.authorID === `${user.id}`){
//                             await messageReaction.users.remove(user.id)
//                             user.send(noClaim())
//                         }
//                         else{
//                             await messageReaction.users.remove(user.id)
//                             claim.claim(user,messageReaction.message.channel)
//                         }
//                     }
//                 }
//                 catch(err){
//                 }
//             })
//         }
        
//         else if(messageReaction.emoji.name === '⛔' && !user.bot){
//             Mongo.validateChannel(messageReaction.message.channel.id,async (result) =>{
//                 try{
//                     if(result.channelID === `${messageReaction.message.channel.id}`){
//                         await messageReaction.users.remove(user.id)
//                         let member_list = messageReaction.message.channel.guild.members.cache.array()
//                         for (member of member_list){
//                             if(member.user.id === user.id){
//                                 if(member.hasPermission('ADMINISTRATOR')){
//                                     await messageReaction.message.channel.send(ticketDeletePopup()).then(async msg=>{
//                                         await delay(5000).then(m=>{
//                                             if(result.claim !== 'none'){
//                                                 Mongo.validateClaim(result.claim,(result5)=> {
//                                                     Mongo.removeClaim(result.claim,result5.count)
//                                                 })
//                                             }
//                                             Mongo.deleteTicket(messageReaction.message.channel.id,async (result)=> {
//                                                 messageReaction.message.channel.delete().catch(err=>{
//                                                     throw err
//                                                 })
//                                             })
//                                         })
//                                     })
//                                 }
//                                 else{
//                                     messageReaction.message.channel.send(noAdmin(user.id))
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 catch(err){
//                 }
//             })
//         }
//     })
    
// });

/*Invokes When a new message send in discord*/
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; //Returns If the prefix is not matching or If the message is sent by BOT

    const args = message.content.slice(prefix.length).split(/ +/); // Spillting up Arguments
    const commandName = args.shift().toLowerCase(); // Converting to Lowercase

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); //Accessing Command from Command Collection in #14

    if (!command) return; // If user command is not matches with our bot command, It returns

    /* If the command should be executed in Guild and the command is executed outside of guild, It'll return with a error message*/
    if (command.guildOnly && message.channel.type !== 'text') {
        function e_invalid() {
            return new Discord.MessageEmbed()
                .setColor('#d40808')
                .setDescription(`I can\'t execute that command inside DMs!`)
                .setTimestamp()
                .setFooter('White2001#0530');
        }
        return message.channel.send(e_invalid())
    }

    /* If command needs any argument and user doesn't provide any argument, It returns with a error message'*/
    if (command.args && !args.length) {

        if (command.usage) {
            function e_invalid() {
                return new Discord.MessageEmbed()
                    .setColor('#d40808')
                    .setDescription(`You didn't provide any arguments, ${message.author}!\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``)
                    .setTimestamp()
                    .setFooter('White2001#0530');
            }

            return message.channel.send(e_invalid()).then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }
        else {
            function e_invalid() {
                return new Discord.MessageEmbed()
                    .setColor('#d40808')
                    .setDescription(`You didn't provide any arguments, ${message.author}!`)
                    .setTimestamp()
                    .setFooter('White2001#0530');
            }

            return message.channel.send(e_invalid()).then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }
    }

    /* If command has any cooldown, It'll validate every request */ 
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            function e_invalid() {
                return new Discord.MessageEmbed()
                    .setColor('#d40808')
                    .setDescription(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    .setTimestamp()
                    .setFooter('White2001#0530');
            }

            return message.channel.send(e_invalid()).then(msg => {
                msg.delete({ timeout: 10000 })
            })
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    /* Executes command, If any error occurs, It goes to Catch Block */
    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        function e_invalid() {
            return new Discord.MessageEmbed()
                .setColor('#d40808')
                .setDescription('There was an error trying to execute that command!')
                .setTimestamp()
                .setFooter('White2001#0530');
        }

        return message.channel.send(e_invalid()).then(msg => {
            msg.delete({ timeout: 10000 })
        })
    }
});

client.login(token); // Bot Login with token