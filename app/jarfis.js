require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const token = process.env.TOKEN;
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');
const responses = getResponses();

client.on('ready', () => {
  console.log('ready to meme');
  if(process.env.ENV ===`Kanto`) {insultRand();}
  console.log(responses);
});

client.on('message', msg => {
  console.log(msg.member + ':' + msg.content);
  //loop through the commands module if msg starts with prefix
  if (msg.content.startsWith(prefix)) {
    args = msg.content.slice(prefix.length).split(' ');

    if (args[0] in commands) {
      commands[args[0]].execute(client, msg, args);
    }
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

function getResponses() {
  return JSON.parse(fs.readFileSync('app/data/responses.json', 'utf8'));
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