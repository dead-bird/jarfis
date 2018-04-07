const core = require('../core.js');

let self = module.exports = {
  alias: ['name'],
  
  desc: '',

  args: '',
  
  execute(client, msg, args) {
    if (!args.length) return;
  
    if (self[args[0]]) return self[args[0]](client, msg, args[1], args[2]); // surely this shouldn't work lmao - ghetto as fuck for running function from argument
  
    return core.err.reply(msg, 'err that\'s not a thing mongo');
  },

  change(client, msg, args) {
    let name = '';

    args.forEach(arg => { name += arg + ' ' });

    msg.guild.member(client.user).setNickname(name).then(() => {
      msg.channel.send(`just call me ${name}`);
    }).catch(err => core.err.dead(msg, err));
  },

  reset(client, msg) {
    msg.guild.member(client.user).setNickname('Jarfis').then(() => {
      msg.channel.send(`reverting to Jarfis. Don't fuck me up again I'm a soft boy`);
    }).catch(err => core.err.dead(msg, err));
  },
}
