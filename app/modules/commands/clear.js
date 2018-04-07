const core = require('../core.js');

let self = module.exports = {
  alias: ['clear'],
  
  desc: 'Hide the edge.',

  args: '',
  
  execute: (client, msg) => {
    msg.delete().then().catch(console.error);

    msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
  }
}
