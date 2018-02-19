require('dotenv').config({path: '.env'});

const Discord = require('discord.js');
const commands = require('./commands.js');
const prefix = '!'; // This is still hard coded in commands.js
const fs = require('fs');
const env = process.env;

let self = module.exports = {
  // init
  init: (client) => {
    client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});

    console.log('meme machine is online');

    if (env.ENV === 'live') {
      setTimeout(self.insult, 600000);

      client.channels.get('380676777170698240').send('What up pimps! It\'s me, ya boy, coming at you with a fresh new instance <:dab:355643174628229120>'); // Maybe add in latest commit here?
    }
  },
  // check if message author is in banlist
  checkAuthor: (client, msg, id) => {
    fs.readFile(`${__dirname}/data/guilds/${id}/banlist.json`, 'utf8', (err, data) => {
      if (err) { console.log(err); }

      if (JSON.parse(data).includes(msg.author.id) && msg.content.startsWith(prefix)) {
        msg.channel.send('Nah soz mate!');

        return false;
      }

      self.listen(client, msg);
    });
  },
  // Loop through the commands module if msg starts with prefix
  listen: (client, msg) => {
    let args;
    let responses = self.getResponses(msg.guild.id);

    if (msg.content.startsWith(prefix)) {
      args = msg.content.slice(prefix.length).split(' ');

      let cmd = args[0].toLowerCase();

      if (cmd in commands) {
        commands[cmd].execute(client, msg, args);
      }
    } else if (Object.prototype.hasOwnProperty.call(responses, msg.content.toLowerCase())) {
      msg.channel.send(responses[msg.content.toLowerCase()]);
    }
  },
  //
  insult: () => {
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


      client.channels.get('380676777170698240').send(`<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${insults[Math.floor(Math.random() * insults.length)]}`);
    }

    randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
    setTimeout(self.insult, randTime);
  },
  //
  getBot: msg => {
    let bot;

    try {
      if ('guild' in msg && 'member' in msg.guild && 'user' in client && msg.guild.member(client.user).nickname) { // this should be beter :c
        bot = msg.guild.member(client.user).nickname;
      } else {
        bot = client.user.username;
      }
    } catch (e) {
      bot = 'Jarfis';
    }

    return bot;
  },
  getResponses: (id) => {
    let path = `${__dirname}/data/guilds/${id}/responses.json`;

    return JSON.parse(fs.readFileSync(path, 'utf8').replace(/{{bot}}/g, self.getBot)); // Just a one of var replacement can expand in future if want to go balls to the wall mental with it
  },
  checkGuild: (id) => {
    fs.readFile(`${__dirname}/data/guilds/guilds.json`, 'utf8', (err, data) => {
      if (err) { console.log(err); }

      let guilds = JSON.parse(data);

      if (!guilds.includes(id)) {
        self.newGuild(guilds, id);
      }
    });
  },
  // Create guild config
  newGuild: (guilds, id) => {
    let path = `${__dirname}/data/guilds/${id}`;

    // Create server directory
    fs.mkdir(path, err => {
      if (err) { console.log(err); }

      // Create blank banlist
      fs.writeFile(`${path}/banlist.json`, JSON.stringify(new Array), err => {
        if (err) { console.log(err); }
      });

      // Create default responses
      let res = {
        lenny: '( ͡° ͜ʖ ͡°)',
        'bye {{bot}}': 'see ya, wouldn\'t wanna meme ya',
        'hey {{bot}}': 'hi bitches',
      };

      fs.writeFile(`${path}/responses.json`, JSON.stringify(res), err => {
        if (err) { console.log(err); }
      });
    });

    // Add server ID to guilds.json
    guilds.push(id);

    fs.writeFile(`${__dirname}/data/guilds/guilds.json`, JSON.stringify(guilds), err => {
      if (err) { console.log(err); }
    });
  },
  // Announce number of pins in a channel
  announcePins: channel => {
    let pins = 0;

    channel.fetchPinnedMessages().then((messages, msg) => {
      messages.map(() => { return pins++ });

      channel.send(pins + '/50 pins my dudes');
    }).catch(console.error);
  },
}
