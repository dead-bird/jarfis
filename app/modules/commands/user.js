const core = require('../core.js');

let self = module.exports = {
  alias: ['user'],
  
  desc: 'Turn your text into 🇪 🇲 🇴 🇯 🇮',

  args: 'some text I guess',

  execute: (client, msg, args) => {
    if (!args.length) return;
  
    if (self[args[0]]) return self[args[0]](client, msg, args[1], args[2]); // surely this shouldn't work lmao - ghetto as fuck for running function from argument
  
    return core.err.reply(msg, 'err that\'s not a thing mongo');
  },

  ban(client, msg, args) {
    let id   = args[0].replace(/<@!(\d*)>|<@(\d*)>/g, '$1'), // grab ID from <!id> or <id>
        user = core.user.get(client, id);

    if (user.banned) return msg.channel.send(`<@${id}> is already banned my dude`);
    
    user.banned = true;
    
    client.losers.set(id, user);
    
    msg.channel.send(`<@${id}> is now banned`).catch(err => core.err.dead(msg, err));
  },

  unban(client, msg, args) {
    let id   = args[0].replace(/<@!(\d*)>|<@(\d*)>/g, '$1'), // grab ID from <!id> or <id>
        user = core.user.get(client, id);

    if (!user.banned) return msg.channel.send(`<@${id}> isn't even banned you ***idiot***`);
    
    user.banned = false;
    
    client.losers.set(id, user);
    
    msg.channel.send(`<@${id}> is now unbanned`).catch(err => core.err.dead(msg, err));
  },
}
