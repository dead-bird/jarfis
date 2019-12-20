const Discord = require('discord.js'),
  core = require('./core.js');

let self = (module.exports = {
  execute(client, msg, args = []) {
    if (!args.length) return self.list(client, msg);

    if (self[args[0]]) return self[args[0]](client, msg, args[1], args[2]); // surely this shouldn't work lmao - ghetto as fuck for running function from argument

    return core.err.reply(msg, "err that's not a thing mongo");
  },

  list(client, msg) {
    let options = core.server.get(client, msg.guild);
    let embed = new Discord.RichEmbed()
      .setColor(3447003)
      .setDescription(
        `:joystick:  Run \`${options.prefix}settings change | [setting name] | [value]\` to edit`
      );

    for (let setting in self.config) {
      if (setting) {
        embed.addField(
          '\u200B',
          `**${self.config[setting].name}** - [${setting}] - ${self.config[
            setting
          ].list(options[setting])}`
        );
      }
    }

    msg
      .delete()
      .then()
      .catch(console.error);
    msg.channel.send({ embed });
  },

  change(client, msg, setting, value) {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return core.err.perms(msg);

    core.server.get(client, msg.guild, options => {
      if (!(setting in options))
        return core.err.reply(
          msg,
          `hmm I don't think I have a setting called \`${setting}\`, maybe get good?`
        );

      self.config[setting].change(value, option => {
        options[setting] = option;

        core.server.set(client, msg.guild.id, options);

        msg
          .reply(`I've set \`${setting}\` to ${option}`)
          .catch(err => core.err.dead(msg, err));
      });
    });
  },

  reset(client, msg) {
    if (!core.roles.daddy(msg.author.id)) return core.err.perms(msg);

    core.server.new(client, msg.guild, () => {
      msg.reply(`I've reset your shit`).catch(err => core.err.dead(msg, err));
    });
  },

  migrate(client, msg) {
    if (!core.roles.daddy(msg.author.id)) return core.err.perms(msg);

    client.guilds.map(guild => {
      let server = core.server.get(client, guild);
      let settings = core.server.default(client, guild);

      for (let option in settings) {
        if (!(option in server)) server[option] = settings[option];
      }

      core.server.set(client, guild.id, server);
    });

    msg
      .reply('yup that should be all good now')
      .catch(err => core.err.dead(msg, err));
  },

  config: {
    prefix: {
      name: ':exclamation: Prefix (currently disabled)',
      // desc: 'Set the prefix that Jarfis responds to. (defaults to !)',
      // change: (value, callback) => callback(value),
      change: () => {
        // Temp killed because changing prefix breaks the bot :jiy:
      },
      list: option => option,
    },
    // insults: {
    //   name: ':broken_heart:  Random Insults',
    //   desc: 'Random Insults On/Off',
    //   change(value, callback) {
    //     let option = false;

    //     if (value === true || value === 'true' || value.toUpperCase() === 'ON') option = true;

    //     return callback(option);
    //   },
    //   list: option => (option ? 'On' : 'Off')
    // },
    // active: {
    //   name: ':clock4:  Active Hours',
    //   desc: 'Set the active hours for random insults',
    //   change: (value, callback) => callback(value),
    //   list: option => option,
    // },
    default: {
      name: ':speech_balloon:  Default Channel',
      desc: 'Set the default channel that Jarfis responds in',
      change: (id, callback) => callback(id.replace(/<#(\d*)>/g, '$1')), // <#id> -> id
      list: id => `<#${id}>`,
    },
    announcements: {
      name: ':round_pushpin:  Pin Announcements',
      desc: 'Announce how many pins are left in a channel',
      change(value, callback) {
        let option = false;

        if (value === true || value === 'true' || value.toUpperCase() === 'ON')
          option = true;

        return callback(option);
      },
      list: option => (option ? 'On' : 'Off'),
    },
    restart: {
      name: ':construction:  Restart Message',
      desc: 'Announce when Jarfis has been restarted',
      change(value, callback) {
        let option = false;

        if (value === true || value === 'true' || value.toUpperCase() === 'ON')
          option = true;

        return callback(option);
      },
      list: option => (option ? 'On' : 'Off'),
    },
    pins: {
      name: ':pushpin:  Bot Pinning Limit',
      desc: 'React count threshold for bot pinning (set to 0 to disable)',
      change(value, callback) {
        let option = 0;
        value = parseInt(value);

        if (value && Number.isInteger(value)) {
          option = parseInt(value);
        } else {
          option = 0;
        }

        return callback(option);
      },
      list: option => (option ? option : '0'),
    },
    twitter: {
      name: ':bird:  Twitter Link Integration',
      desc:
        'Choose if jarfis expands tweet links posted that have more than 2 images',
      change(value, callback) {
        let option = false;

        if (value === true || value === 'true' || value.toUpperCase() === 'ON')
          option = true;

        return callback(option);
      },
      list: option => (option ? 'On' : 'Off'),
    },
  },
});
