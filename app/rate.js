require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const token = process.env.TOKEN;
const greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe'];
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');

client.on('ready', () => {
  console.log('ready to meme');


  // Started working on random insult
  // ==================================
  //
  // var users = client.users.array(),
  //     losers = [];

  // for (var i = users.length - 1; i >= 0; i--) {
  //   if (!users[i].bot && users[i] instanceof Discord.User) losers.push(users[i]);
  // }

  // client.channels.get('354952778029989898').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
});

client.on('message', msg => {
  //loop through the commands module if msg starts with prefix
  if (msg.content.startsWith(prefix)) {
    args = msg.content.slice(prefix.length).split(' ');

    if (args[0] in commands) {
      commands[args[0]].execute(client, msg, args);
    }
  }

  //these still need doing
  if (msg.content == `bye ${getBot(msg)}`) {
    msg.channel.send('see ya, wouldn\'t wanna meme ya');
  }

  if (greetings.indexOf(msg.content.split(' ')[0]) > -1 && msg.content.split(' ')[1] == getBot(msg)) {
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

function getBot(msg) {
  return (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);
}

client.login(token);
