const core = require('../core.js');

let self = module.exports = {
  alias: ['insult'],
  
  desc: '@ me',

  args: '@user',

  execute: (client, msg, args) => {
    if (!args.length) return msg.reply(`Small **oof** my dude I need someone to insult`);
    let user = args[0].match(/<@!\d*>/g);

    if (!user) return msg.reply(`Small **oof** my dude *${args[0]}* isnt a user`);
    let insults = fs.readFileSync(`${__dirname}/data/insults.txt`).toString().split('\n');
    let selectedInsult = insults[Math.floor(Math.random() * insults.length)];

    msg.channel.send(`${user} you ${selectedInsult}`);
  }
}
