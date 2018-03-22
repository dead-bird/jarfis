require('dotenv').config({path: '.env'});

const Discord    = require('discord.js'),
      fs         = require('fs'),
      env        = process.env;

let self = module.exports = {
  // need to put init back in

  // users
  getUser(client, id) {
    return client.losers.get(id) || self.newUser(client, id);
  },
  newUser(client, id) {
    let user = { banned: false };

    client.losers.set(id, user);

    return user;
  },

  // servers
  getGuild(client, guild) {
    return client.servers.get(guild.id) || self.newGuild(client, guild);
  },
  setGuild(client, id, server) {
    return client.servers.set(id, server);
  },
  newGuild(client, guild, respond = false) {
    if (!guild) return;

    let server = {
      prefix: "!",
      insults: true,
      active: "",
      default: (guild.channels ? guild.channels.first().id : null),
      announcements: false,
      responses: {
        lenny: "( ͡° ͜ʖ ͡°)",
      },
    };

    client.servers.set(guild.id, server);

    if (respond && server.default) {
      let id = server.default,
          pf = server.prefix;

      client.channels.get(id).send(`What up pimps! My prefix is \`${pf}\` and your default channel is <#${id}>. Hit dat fatty \`${pf}help\` to change shit`);
    }

    return server;
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
}
