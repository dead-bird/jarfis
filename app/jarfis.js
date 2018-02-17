require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const core = require('./core.js');
const client = new Discord.Client({forceFetchUsers: true});
const env = process.env;
const devId = '347775461855854612';

client.on('ready', () => {
  core.init();
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
  core.checkGuild();
});

// Pin Announcements
client.on('channelPinsUpdate', (channel, time) => {
  core.announcePins(channel);
});

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
