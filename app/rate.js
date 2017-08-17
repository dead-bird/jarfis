require('dotenv').config({path: '../.env'});

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;
const regex = /!r(.*)([0-5])/g;

client.on('ready', () => {
  console.log('ready to meme');
});

client.on('message', message => {
  var match = regex.exec(message.content);

  if (match) {
    message.channel.send('', {
        file: `resources/${match[2]}.png`
    });
  }
  
  if (message.content == 'bye memestar') {
    message.channel.send('see ya, wouldn\'t wanna meme ya');
  }

  if (message.content == 'hi memestar') {
    message.channel.send('hi bitches');
  }
});

client.login(token);
