require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true});
const env = process.env;
const prefix = '!'; // This is still hard coded in commands.js
const insults = fs.readFileSync(`${__dirname}/data/insults.txt`).toString().split('\n');
const responses = importResponses();
const devId = '347775461855854612';


client.on('ready', () => {
  client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});
  console.log('meme machine is online');
  if (env.ENV === 'live') {
    setTimeout(insultRand, 600000);
    client.channels.get('354952778029989898').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance'); // Maybe add in latest commit here?
  }
});

client.on('message', msg => {
  let id = 0; // This is here to avoid an id of null when dm

  try {
    id = msg.guild.id;
  } catch (e) {

  }

  if (env.ENV === 'dev' && id === devId) {
    listen(client, msg);
  } else if (env.ENV !== 'dev' && id !== devId) {
    listen(client, msg);
  }
});

function listen(client, msg) {
// This is very bad, i know its very bad, but i am very bad at being good.... and coding. Feel free to improve
  let banlist = fs.readFileSync(`${__dirname}/data/banlist.json`, 'utf8');
  let isBanned = false;

  if (banlist) {
    let aBanlist = JSON.parse(banlist);
    isBanned = aBanlist.includes(msg.author.id);
  }

  if (isBanned) {
    if (msg.content.startsWith(prefix)) {
      msg.channel.send('Nah soz mate!');
    }
  } else {
    let args;

    // Loop through the commands module if msg starts with prefix
    if (msg.content.startsWith(prefix)) {
      args = msg.content.slice(prefix.length).split(' ');

      if (args[0] in commands) {
        commands[args[0]].execute(client, msg, args);
      }
    } else if (Object.prototype.hasOwnProperty.call(responses, msg.content.toLowerCase())) {
      msg.channel.send(responses[msg.content.toLowerCase()]);
    }
  }
}

function insultRand() {
  let users = client.users.array();
  let losers = [];
  let minTrig = 10800000; // Triggers between 3 and 6 hours
  let maxTrig = 21600000;
  let randTime = 0;
  let date = new Date();

  if (date.getDay() > 0 && date.getDay() < 6 && date.getHours() >= 9) {
    for (var i = users.length - 1; i >= 0; i--) {
      if (!users[i].bot && users[i] instanceof Discord.User) {
        losers.push(users[i]);
      }
    }

    client.channels.get('354952778029989898').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
  }
  randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  setTimeout(insultRand, randTime);
}

function getBot(msg) {
  let bot;

  try {
    if ('guild' in msg && 'member' in msg.guild && 'user' in client && msg.guild.member(client.user).nickname) {
      bot = msg.guild.member(client.user).nickname;
    } else {
      bot = client.user.username;
    }
  } catch (e) {
    bot = 'Jarfis';
  }

  return bot;
}

function importResponses() {
  let botName = getBot;
  return JSON.parse(fs.readFileSync(`${__dirname}/data/responses.json`, 'utf8').replace(/{{bot}}/g, botName)); // Just a one of var replacement can expand in future if want to go balls to the wall mental with it
}

client.login(env.TOKEN);

//       _             _
//      //             \\
//     /'               `\
//    /,'     ..-..     `.\
//   /,'   .''     ``.   `.\
//  /,'   :   .---.   :   `.\
// I I   :  .'\   /`.  :   I I
// I b__:   . .`~'. .   :__d I
// I p~~:   . `._.' .   :~~q I
// I I   :   ./   \.   :   I I
//  \`.   :   `---'   :   ,'/
//   \`.   `..     ..'   ,'/
//    \`.     ``~''     ,'/
//     \`               '/
//      \\             //
//       ~             ~
