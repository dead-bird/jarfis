require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client();
const token = process.env.TOKEN;
const greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe'];
const prefix = '!'; //this is still hard coded in commands.js

var bot = {};

try {
  bot = JSON.parse(fs.readFileSync('app/data/bot.json'));
} catch (err) {
  commands.reset.execute();
}

client.on('ready', () => { console.log('ready to meme'); });

client.on('message', msg => {
  //loop through the commands module if msg starts with prefix
  if (msg.content.startsWith(prefix)) {
    args = msg.content.slice(prefix.length).split(' ');

    if (args[0] in commands) {
      commands[args[0]].execute(client, msg, args, bot);
    }
  }

  //these still need doing
  if (msg.content == `bye ${bot.name}`) {
    msg.channel.send('see ya, wouldn\'t wanna meme ya');
  }

  if (greetings.indexOf(msg.content.split(' ')[0]) > -1 && msg.content.split(' ')[1] == bot.name) {
    msg.channel.send('hi bitches');
  }

  if (msg.content == 'too pure for this world') {
    msg.channel.send(`thank you senpai`);
  }

  if (msg.content == '/lenny') {
    msg.delete()
      .then()
      .catch(console.error);
      
    msg.channel.send(`( ͡° ͜ʖ ͡°)`);
  }
});

client.login(token);
