require('dotenv').config({ path: '.env' });

const Discord = require('discord.js');
const fs = require('fs');
const env = process.env;
const pins = require('./resources/pins');

let self = (module.exports = {
  // need to put init back in

  user: {
    // Grab ID from message @user
    findId: id => id.replace(self.regex.userId, '$1'),

    get(client, id) {
      return client.losers.get(id) || self.user.new(client, id);
    },
    set() {
      // will probably use
    },
    new(client, id) {
      let user = { banned: false };

      client.losers.set(id, user);

      return user;
    },
  },

  server: {
    get(client, guild, callback = false) {
      let options =
        client.servers.get(guild.id) || self.server.new(client, guild);

      return typeof callback === 'function' ? callback(options) : options;
    },
    set(client, id, options) {
      return client.servers.set(id, options);
    },
    new(client, guild, callback = false) {
      //I feel like new() should be in set() if nothing is passed maybe?
      if (!guild) return;

      let options = self.server.default(client, guild);

      client.servers.set(guild.id, options);

      return typeof callback === 'function' ? callback(options) : options;
    },
    default(client, guild) {
      return {
        prefix: '!',
        insults: false,
        active: '',
        default: guild.channels ? guild.channels.first().id : null,
        announcements: true,
        restart: false,
        responses: {
          lenny: { response: '( ͡° ͜ʖ ͡°)', author: client.user.id },
        },
      };
    },
  },

  // channels
  newPin(channel) {
    channel
      .fetchPinnedMessages()
      .then(messages => {
        const i = messages.array().length;

        channel.send(i + `/50 pins ${pins[i - 1]}`).catch(console.error);
      })
      .catch(console.error);
  },

  // Error Handler
  err: {
    empty(msg, text = 'Small **oof** my dude I need some text') {
      self.err.reply(msg, text);
    },
    args(msg, i = 2) {
      self.err.reply(
        msg,
        `Small **oof** my dude please give me ${i} ${
          i > 1 ? 'inputs' : 'input'
        }`
      );
    },
    dead(msg, err) {
      self.err.reply(msg, `Small **oof** my dude ${err}`);
    },
    perms(msg) {
      self.err.reply(
        msg,
        "that's a big 7k **oof** my dude, you don't have permission to do that"
      );
    },
    reply(msg, text) {
      msg.reply(text || `Small **oof** my dude`).catch(error => {
        console.log(
          `oh my christ if it's fucked up here lord help us:\n ${error}`
        );
      });
    },
  },

  roles: {
    daddy: id => env.OWNERS.split(', ').includes(id),
  },

  msg: {
    replace: {
      emotes: (m = '') => m.replace(self.regex.emote, '$1'),
    },
  },

  regex: {
    emote: /(?:<|<a)(:\w{1,50}:)(?:\d{10,100}>)/gi,
    userId: /<@!?(\d*)>/gi,
  },

  csit: '440511380160905217',
});
