const core = require('../core.js');

let self = module.exports = {
  alias: ['echo'],
  
  desc: 'Speak on Jarfis\' behalf.',

  args: '<string>',

  execute: (client, msg, args) => {
    if (!args.length) return core.err.empty(msg);

    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    msg.delete().then().catch(console.error);

    msg.channel.send(str).catch(err => core.err.dead(msg, err));
  }
}
