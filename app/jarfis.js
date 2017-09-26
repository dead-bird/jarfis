require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const token = process.env.TOKEN;
const greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe', 'whaddup'];
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');

client.on('ready', () => {
  console.log('ready to meme');
  if(process.env.ENV ===`Kanto`) {insultRand();}
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

function insultRand() {
  var users = client.users.array(),
      losers = [];
      minTrig = 3600000; //trigger times 1 and 2 hours
      maxTrig = 7200000;
      randTime = 0;

  for (var i = users.length - 1; i >= 0; i--) {
    if (!users[i].bot && users[i] instanceof Discord.User) losers.push(users[i]);
  }

  client.channels.get('354952778029989898').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);

  randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  setTimeout(insultRand, randTime);
}

function getBot(msg) {
  return (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);
}

client.login(token);
