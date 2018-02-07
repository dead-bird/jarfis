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
    client.channels.get('380676777170698240').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance <:dab:355643174628229120>'); // Maybe add in latest commit here?
  }
});

client.on('message', msg => {
  let id = 0; // This is here to avoid an id of null when dm

  try {
    id = msg.guild.id;
  } catch (e) {

  }

  if (id) {
    if (env.ENV === 'dev' && id === devId) {
      checkAuthor(client, msg, id);
    } else if (env.ENV !== 'dev' && id !== devId) {
      checkAuthor(client, msg, id);
    }
  }
});

// check if message author is in banlist
function checkAuthor(client, msg, id) {
  fs.readFile(`${__dirname}/data/servers/${id}/banlist.json`, 'utf8', (err, data) => {
    if (err) { console.log(err); }

    if (JSON.parse(data).includes(msg.author.id) && msg.content.startsWith(prefix)) {
      msg.channel.send('Nah soz mate!');

      return false;
    }

    listen(client, msg);
  });
}

// Loop through the commands module if msg starts with prefix
function listen(client, msg) {
  let args;

  if (msg.content.startsWith(prefix)) {
    args = msg.content.slice(prefix.length).split(' ');

    let cmd = args[0].toLowerCase();

    if (cmd in commands) {
      commands[cmd].execute(client, msg, args);
    }
  } else if (Object.prototype.hasOwnProperty.call(responses, msg.content.toLowerCase())) {
    msg.channel.send(responses[msg.content.toLowerCase()]);
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

    client.channels.get('380676777170698240').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
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

// Create server shit when Jarfis joins a server
client.on("guildCreate", (guild) => {
  fs.readFile(`${__dirname}/data/servers/guilds.json`, 'utf8', (err, data) => {
    if (err) { console.log(err); }

    let guilds = JSON.parse(data);

    if (!guilds.includes(guild.id)) {
      newConfig(guilds, guild.id);
    }
  });
});

// Create server config
function newConfig(guilds, id) {
  let path = `${__dirname}/data/servers/${id}`;

  // Create server directory
  fs.mkdir(path, (err) => {
    if (err) { console.log(err); }

    // Create blank banlist
    fs.writeFile(`${path}/banlist.json`, JSON.stringify(new Array), (err) => {
      if (err) { console.log(err); }
    });

    // Create blank responses
    fs.writeFile(`${path}/responses.json`, JSON.stringify(new Object()), (err) => {
      if (err) { console.log(err); }
    });
  });

  // Add server ID to guilds.json
  guilds.push(id);

  fs.writeFile(`${__dirname}/data/servers/guilds.json`, JSON.stringify(guilds), (err) => {
    if (err) { console.log(err); }
  });
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
