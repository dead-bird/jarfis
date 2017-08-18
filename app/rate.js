require('dotenv').config({path: '../.env'});

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;
const regex = /!r(.*)([0-5])/g;

var greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe'];

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

  if (greetings.indexOf(message.content.split(' ')[0]) > -1 && message.content.substr(message.content.length - 8) == 'memestar') {
    message.channel.send('hi bitches');
  }

  if (message.content == 'clear'){
    message.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
  }


});

client.login(token);
