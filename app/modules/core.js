require('dotenv').config({path: '.env'});

const Discord    = require('discord.js'),
      fs         = require('fs'),
      env        = process.env;

let self = module.exports = {
  // need to put init back in


  user: {
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
      let options = client.servers.get(guild.id) || self.server.new(client, guild);

      return typeof callback === 'function' ? callback(options) : options;
    },
    set(client, id, options) {
      return client.servers.set(id, options);
    },
    new(client, guild, callback = false) { //I feel like new() should be in set() if nothing is passed maybe?
      if (!guild) return;

      let options = self.server.default(client, guild);

      client.servers.set(guild.id, options);

      return typeof callback === 'function' ? callback(options) : options;
    },
    default(client, guild) {
      return {
        prefix: "!",
        insults: true,
        active: "",
        default: (guild.channels ? guild.channels.first().id : null),
        announcements: true,
        restart: false,
        responses: {
          lenny: { response: "( ͡° ͜ʖ ͡°)", author: client.user.id },
        },
      };
    },
  },

  // channels
  newPin(channel) {
    let pins = 0;

    channel.fetchPinnedMessages().then((messages, msg) => {
      messages.map(() => { return pins++ });
      if (pins >= 45) {
        channel.send(pins + '/50 pins getting a little cramped my dudes');
      }else{
        channel.send(pins + '/50 pins my dudes');
      }
    }).catch(console.error);
  },

  // Error Handler
  err: {
    empty(msg, text = 'Small **oof** my dude I need some text') {
      self.err.reply(msg, text);
    },
    args(msg, i = 2) {
      self.err.reply(msg, `Small **oof** my dude please give me ${i} ${i > 1 ? 'inputs' : 'input'}`);
    },
    dead(msg, err) {
      self.err.reply(msg, `Small **oof** my dude ${err}`);
    },
    perms(msg) {
      self.err.reply(msg, 'that\'s a big 7k **oof** my dude, you don\'t have permission to do that');
    },
    reply(msg, text) {
      msg.reply(text || `Small **oof** my dude`).catch(error => {
        console.log(`oh my christ if it's fucked up here lord help us:\n ${error}`)
      });
    }
  },

  roles: {
    daddy: id => env.OWNERS.split(', ').includes(id),
  }
}
