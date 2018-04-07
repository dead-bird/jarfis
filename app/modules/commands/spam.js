const core = require('../core.js');

let self = module.exports = {
  alias: ['spam'],
  
  desc: 'spam some shit idk',

  args: '[text]',

  execute: (client, msg, args) => {
    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    msg.delete().catch(console.error);
    
    for (i = 0 ; i < 5 ; i++) {
      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    }
  }
}
