const core = require('../core.js');

let self = module.exports = {
  alias: ['rc'],
  
  desc: 'RaNCApS YOUR TeXt.',

  args: '[text]',

  execute: (client, msg, args) => {
    if (!args.length) return core.err.empty(msg);

    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    let a = str.split('');
    let n = a.length;

    for (i = n - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * n) + 1;
      a[r] = (a[r] ? a[r].toUpperCase() : '');
    }

    msg.delete().then().catch(console.error);

    msg.channel.send(a.join('')).catch(err => core.err.dead(msg, err));
  }
}
