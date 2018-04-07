const core = require('../core.js');

let self = module.exports = {
  alias: ['clap'],
  
  desc: ':clap:get:clap:your:clap:point:clap:across:clap:',

  args: '<string>(-raw)',

  execute: (client, msg, args) => {
    let clap = ':clap:';
    
    if (args[0] === '-raw') {
      clap = '\\👏';
      args.splice(0, 1);
    }
    
    let str = clap; // Prepend a clap
    
    args.forEach(arg => { str += arg + clap });

    msg.delete().then().catch(console.error);
    msg.channel.send(str).catch(err => core.err.dead(msg, err));
  }
}
