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