const core = require('../core.js');

let self = module.exports = {
  alias: ['banner'],
  
  desc: 'Turn your text into 🇪 🇲 🇴 🇯 🇮',

  args: 'some text I guess',

  execute: (client, msg, args) => {
    if (!args.length) return core.err.empty(msg);
    
    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    let numStr = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
    let a = str.toLowerCase()
      .replace(/([a-z])/g, ':regional_indicator_$1: ')
      .replace(/([0-9])/g, $1 => numStr[$1] );

    msg.delete().catch(console.error);
    msg.channel.send(a).catch(err => core.err.dead(msg, err));
  },
}
