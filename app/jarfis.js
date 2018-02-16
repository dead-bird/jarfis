require('dotenv').config({path: '.env'});

const fs = require('fs');
const Discord = require('discord.js');
const core = require('./core.js');
const client = new Discord.Client({forceFetchUsers: true});
const env = process.env;
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
      core.checkAuthor(client, msg, id);
    } else if (env.ENV !== 'dev' && id !== devId) {
      core.checkAuthor(client, msg, id);
    }
  }
});

// Create server shit when Jarfis joins a server
client.on('guildCreate', (guild) => {
  fs.readFile(`${__dirname}/data/servers/guilds.json`, 'utf8', (err, data) => {
    if (err) { console.log(err); }

    let guilds = JSON.parse(data);

    if (!guilds.includes(guild.id)) {
      core.newConfig(guilds, guild.id);
    }
  });
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
