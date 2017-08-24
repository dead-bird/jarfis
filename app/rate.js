require('dotenv').config({path: '../.env'});

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'MzQ5MTkzMjUzNTYxNTY1MTg2.DH801w.fccyJIqNVSegZoX1HKSy7xdS0aM';
const rate = /^!r(|\s*)([0-5])/g;

var bot;

try {
  bot = JSON.parse(fs.readFileSync('app/data/bot.json'));
} catch (err) {
  name('Jarfis');
}

var greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe'];
var nameChange = new RegExp('hey (' + bot.name + '), change your name to (.*)');

function name(name) {
  fs.writeFileSync('app/data/bot.json', JSON.stringify({name: name}));

  bot = JSON.parse(fs.readFileSync('app/data/bot.json'));
}

client.on('ready', () => {
  console.log('ready to meme');
});

client.on('message', message => {
  var rateMatch = rate.exec(message.content);
  var nameMatch = nameChange.exec(message.content);

  if (rateMatch) {
    message.delete()
     .then()
     .catch(console.error);

    message.channel.send(message.member.nickname ? message.member.nickname : message.author.username, {
      file: `resources/${rateMatch[2]}.png`
    });
  }
  
  if (message.content == `bye ${bot.name}`) {
    message.channel.send('see ya, wouldn\'t wanna meme ya');
  }

  if (nameMatch) {
    name(nameMatch[2]);
    message.channel.send('sure thing my dude');
  }

  if (greetings.indexOf(message.content.split(' ')[0]) > -1 && message.content.split(' ')[1] == bot.name) {
    message.channel.send('hi bitches');
  }

  if (message.content == 'clear') {
    message.delete()
     .then()
     .catch(console.error);

    message.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
  }

  if (message.content == '!commands') {
    message.channel.send(`be patient, ${message.member.nickname ? message.member.nickname : message.author.username}, I'm bloody working on it.`);
  }

  if (message.content == '!name') {
    message.channel.send(`the name's ${bot.name}, don't wear it out`);
  }

  if (message.content == 'too pure for this world') {
    message.channel.send(`thank you senpai`);
  }

  if (message.content == '!reset') {
    name('Jarfis');
    message.channel.send(`reverting to ${bot.name}. Don't fuck me up again I'm a soft boy`);
  }
});

client.login(token);
