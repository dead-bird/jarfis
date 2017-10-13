require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const token = process.env.TOKEN;
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');
const responses = importResponses();

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
  } else {
    if (responses.hasOwnProperty(msg.content.toLowerCase()))
      msg.channel.send(responses[msg.content.toLowerCase()]);
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

function importResponses() {
  let botName = getBot
  return JSON.parse(fs.readFileSync('app/data/responses.json', 'utf8').replace(/{{bot}}/g, botName)); //just a one of var replacement can expand in future if want to go balls to the wall mental with it
}

client.login(token);

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