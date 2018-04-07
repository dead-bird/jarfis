const core = require('../core.js');

let self = module.exports = {
  alias: ['r', 'rate'],

  desc: 'Rates a meme.',

  args: '<integer between 0 and 5>',

  valid: (i) => {
    return i >= 0 && i <= 5;
  },

  execute: (client, msg, args) => {
    if (!self.r.valid(args[0])) return msg.reply('gimme dat fatty number between 0-5 ya\'dig'); // add to error handler

    msg.delete().then().catch(console.error);

    msg.channel.send(msg.member.nickname || msg.author.username, {
      file: `app/resources/responses/rate/${args[0]}.png`
    }).catch(err => core.err.dead(msg, err));
  }
}
