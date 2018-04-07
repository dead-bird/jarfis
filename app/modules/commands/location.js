const core = require('../core.js');

let self = module.exports = {
  alias: ['loc'],
  
  desc: 'Where tf am I',

  args: '',

  execute: (client, msg) => {
    msg.channel.send(`chillin' at ${env.LOC}`);
    client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});
  }
}
