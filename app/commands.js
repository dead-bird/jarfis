const fs = require('fs');

module.exports = {
  help: {
    desc: 'Lists all available commands.',
    args: '',
    execute: (client, msg, args, bot) => {
      var fields = [];

      for (var command in module.exports) {
        fields.push({name: `!${command} ${module.exports[command].args}`, value: module.exports[command].desc + '\n\n\n\n\n'});
      }

      msg.channel.send({embed: {
        color: 3447003,
        fields: fields
      }});
    }
  },
  name: {
    desc: 'Returns the current name of the bot.',
    args: '',
    execute: (client, msg, args, bot) => {
      msg.channel.send(`the name's ${bot.name}, don't wear it out`);
    }
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    execute: (client, msg, args) => {
      msg.channel.send(msg.member.nickname ? msg.member.nickname : msg.author.username, {
        file: `resources/${args[1]}.png`
      });
    }
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string containing the name you wish to set>',
    execute: (client, msg, args) => {
      fs.writeFileSync('app/data/bot.json', JSON.stringify({name: args[1]}));

      bot = JSON.parse(fs.readFileSync('app/data/bot.json'));

      msg.channel.send(`the name's ${bot.name}, don't wear it out`);
    }
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: '',
    execute: (client, msg) => {
      fs.writeFileSync('app/data/bot.json', JSON.stringify({name: 'Jarfis'}));

      bot = JSON.parse(fs.readFileSync('app/data/bot.json'));

      if (msg) {
        msg.channel.send(`reverting to ${bot.name}. Don't fuck me up again I'm a soft boy`);
      }
    }
  },
  clear: {
    desc: 'Hide the edge',
    args: '',
    execute: (client, msg) => {
      msg.delete()
       .then()
       .catch(console.error);

      msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
    }
  }
};
