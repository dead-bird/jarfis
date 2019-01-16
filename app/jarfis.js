require('dotenv').config({ path: '.env' });

const commands = require('./commands.js'),
  Level = require('enmap-level'),
  Discord = require('discord.js'),
  client = new Discord.Client({ forceFetchUsers: true }),
  core = require('./core.js'),
  Enmap = require('enmap'),
  env = process.env;

client.on('ready', () => {
  client.servers = new Enmap({ provider: new Level({ name: 'servers' }) });
  client.losers = new Enmap({ provider: new Level({ name: 'losers' }) });

  client.user.setPresence({ game: { name: `in ${env.LOC}`, type: 0 } });

  console.log('meme machine is online');

  if (env.ENV === 'dev') return;

  client.servers.defer.then(() => {
    // all data is loaded now.
    client.guilds.map(guild => {
      core.server.get(client, guild, s => {
        if (!s.restart) return;

        client.channels
          .get(s.default)
          .send(
            "What up pimps! It's me, ya boy, coming at you with a fresh new instance <:dab:355643174628229120>"
          )
          .catch(console.error); // Maybe add in latest commit here?
      });
    });
  });

  // setTimeout(self.insult, 600000);
});

client.on('message', msg => {
  if (msg.author.bot || !msg.guild) return;

  let id = msg.guild.id || 0;

  if (
    (env.ENV === 'dev' && id === env.DEV_ID) ||
    (env.ENV !== 'dev' && id !== env.DEV_ID)
  ) {
    listen(client, msg);
  }
});

// Create server shit when Jarfis joins a server
client.on('guildCreate', guild => {
  core.server.new(client, guild, options => {
    let id = options.default,
      pf = options.prefix;

    client.channels
      .get(id)
      .send(
        `What up pimps! My prefix is \`${pf}\` and your default channel is <#${id}>. Hit dat fatty \`${pf}help\` to change shit`
      );
  });
});

// Pin Announcements
client.on('channelPinsUpdate', (channel, time) => {
  let id = channel.guild.id || 0;

  if (
    (env.ENV === 'dev' && id === env.DEV_ID) ||
    (env.ENV !== 'dev' && id !== env.DEV_ID)
  ) {
    core.newPin(channel);
  }
});

client.login(env.TOKEN);

// Loop through the commands module if msg starts with prefix
function listen(client, msg) {
  let guild = core.server.get(client, msg.guild),
    user = core.user.get(client, msg.author.id);

  if (msg.content.startsWith(guild.prefix)) {
    if (user.banned) return msg.channel.send('Nah soz mate!');

    let message = msg.content.split(/^(?:!(\w+))/);

    let cmd = message[1];
    if (message[2]) {
      let args = message[2].split(/ \| /);
      args = args.map(str => (str = str.trim()));
    }
    if (cmd in commands) {
      commands[cmd].execute(client, msg, args);
    }
  } else if (
    Object.prototype.hasOwnProperty.call(
      guild.responses,
      msg.content.toLowerCase()
    )
  ) {
    msg.channel.send(guild.responses[msg.content.toLowerCase()].response);
  }
}

function insult() {
  // haha dead code
  console.log('insult time :wehehehe:');
  // let users = client.users.array();
  // let losers = [];
  // let minTrig = 10800000; // Triggers between 3 and 6 hours
  // let maxTrig = 21600000;
  // let randTime = 0;
  // let date = new Date();
  // let insults = fs
  //   .readFileSync(`${__dirname}/data/insults.txt`)
  //   .toString()
  //   .split('\n');

  // if (date.getDay() > 0 && date.getDay() < 6 && date.getHours() >= 9) {
  //   for (var i = users.length - 1; i >= 0; i--) {
  //     if (!users[i].bot && users[i] instanceof Discord.User) {
  //       losers.push(users[i]);
  //     }
  //   }

  //   client.channels
  //     .get('415900255691866122')
  //     .send(
  //       `<@${losers[Math.floor(Math.random() * losers.length)].id}> you ${
  //         insults[Math.floor(Math.random() * insults.length)]
  //       }`
  //     );
  // }

  // randTime = Math.floor(Math.random() * (maxTrig - minTrig)) + minTrig;
  // setTimeout(insult, randTime);
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
