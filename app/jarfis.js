require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const commands = require('./commands.js');
const client = new Discord.Client({forceFetchUsers: true})
const env = process.env;
const prefix = '!'; //this is still hard coded in commands.js
const insults = fs.readFileSync('app/data/insults.txt').toString().split('\n');
const responses = importResponses();
const devID = 347775461855854612;

client.on('ready', () => {
  console.log('meme machine is online');
  if (env.ENV === 'live') {
    setTimeout(insultRand,600000);
    client.channels.get('354952778029989898').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance') //maybe add in latest commit here?
  }
});

client.on('message', msg => {
  let id = msg.guild.id;

  env.ENV === 'dev' ? (id == devID ? listen(client, msg) : '') : (id != devID ? listen(client, msg) : ''); //shitty ternary for now ygm :dab:
});

function listen(client, msg) {
  //loop through the commands module if msg starts with prefix
  if (msg.content.startsWith(prefix)) {
    args = msg.content.slice(prefix.length).split(' ');

    if (args[0] in commands) {
      commands[args[0]].execute(client, msg, args);
    }
  } else {
    if (responses.hasOwnProperty(msg.content.toLowerCase())) {
      msg.channel.send(responses[msg.content.toLowerCase()]);
    }
  }
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

function importResponses() {
  let botName = getBot;
  return JSON.parse(fs.readFileSync('app/data/responses.json', 'utf8').replace(/{{bot}}/g, botName)); //just a one of var replacement can expand in future if want to go balls to the wall mental with it
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
