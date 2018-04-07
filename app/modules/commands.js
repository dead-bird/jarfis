require('dotenv').config({path: '.env'});

const core = require('./core.js');
const dir = './commands';
const commands = {
  responses: require(`${dir}/responses.js`),
  settings:  require(`${dir}/settings.js`),
  edrake:    require(`${dir}/settings.js`),
  loc:       require(`${dir}/location.js`),
  banner:    require(`${dir}/banner.js`),
  insult:    require(`${dir}/insult.js`),
  clear:     require(`${dir}/clear.js`),
  drake:     require(`${dir}/drake.js`),
  think:     require(`${dir}/think.js`),
  user:      require(`${dir}/user.js`),
  clap:      require(`${dir}/clap.js`),
  echo:      require(`${dir}/echo.js`),
  flip:      require(`${dir}/flip.js`),
  help:      require(`${dir}/help.js`),
  name:      require(`${dir}/name.js`),
  spam:      require(`${dir}/spam.js`),
  r:         require(`${dir}/rate.js`),
  rc:        require(`${dir}/rc.js`),
}

module.exports = {
  run(client, msg, server) {
    if (core.user.get(client, msg.author.id).banned) return msg.channel.send('Nah soz mate!');

    let args = msg.content.slice(server.prefix.length).trim().split(/ +/g),
        cmd  = args.shift().toLowerCase();

    if (cmd in commands) {
      // commands[cmd].execute(client, msg, args);
      commands[cmd];
    }
  },
}