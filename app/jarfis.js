require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const token = process.env.TOKEN;
const greetings = ['hey', 'hi', 'yo', 'sup', 'sound', 'safe', 'whaddup'];
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');
const mute = false; //stops bot responses

client.on('ready', () => {
  console.log('meme machine is online');
  if (process.env.ENV === `Kanto`) {
    setTimeout(insultRand,600000);
    client.channels.get('354952778029989898').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance') //maybe add in latest commit here?
  }
});

if (mute === false) {
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
}

function insultRand() {
  let users = client.users.array(),
      losers = [];
      minTrig = 36000000; //triggers between 10 and 12 hours
      maxTrig = 43200000;
      randTime = 0;
      date = new Date();

  if (date.getDay() > 0 && date.getDay() < 6 && date.getHours() >= 9) {
    for (var i = users.length - 1; i >= 0; i--) {
      if (!users[i].bot && users[i] instanceof Discord.User) losers.push(users[i]);
    }

    client.channels.get('354952778029989898').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
  }
  randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  setTimeout(insultRand, randTime);
}

function getBot(msg) {
  try {
    if ('guild' in msg && 'member' in msg.guild && 'user' in client && msg.guild.member(client.user).nickname) {
        var bot = msg.guild.member(client.user).nickname;
    } else {
        var bot = client.user.username;
    }
  } catch (e) {
    var bot = 'Jarfis';
  }

return bot;
}

client.login(token);
