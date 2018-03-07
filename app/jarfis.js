require('dotenv').config({path: '.env'});

const Discord = require('discord.js'),
      client  = new Discord.Client({forceFetchUsers: true}),
      devId   = '347775461855854612',
      core    = require('./core.js'),
      fs      = require('fs'),
      env     = process.env;

client.on('ready', () => {
  client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});

  console.log('meme machine is online');

  if (env.ENV === 'live') {
    setTimeout(insult, 600000);

    client.channels.get('415900255691866122').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance <:dab:355643174628229120>'); // Maybe add in latest commit here?
  }
});

client.on('message', msg => {
  let id = 0; // This is here to avoid an id of null when dm

  try {
    id = msg.guild.id;
  } catch (e) {

  }

  if (id) { // this is fucking tragic :c
    if (env.ENV === 'dev' && id === devId) {
      core.checkAuthor(client, msg, id);
    } else if (env.ENV !== 'dev' && id !== devId) {
      core.checkAuthor(client, msg, id);
    }
  }
});

// Create server shit when Jarfis joins a server
client.on('guildCreate', guild => {
  core.checkGuild(guild.id);
});

// Pin Announcements
client.on('channelPinsUpdate', (channel, time) => {
  core.announcePins(channel);
});

client.login(env.TOKEN);

function insult() {
  let users = client.users.array();
  let losers = [];
  let minTrig = 10800000; // Triggers between 3 and 6 hours
  let maxTrig = 21600000;
  let randTime = 0;
  let date = new Date();
  let insults = fs.readFileSync(`${__dirname}/data/insults.txt`).toString().split('\n');

  if (date.getDay() > 0 && date.getDay() < 6 && date.getHours() >= 9) {
    for (var i = users.length - 1; i >= 0; i--) {
      if (!users[i].bot && users[i] instanceof Discord.User) {
        losers.push(users[i]);
      }
    }

    client.channels.get('415900255691866122').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
  }

  randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  setTimeout(insult, randTime);
}

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
