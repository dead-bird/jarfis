const core = require('../core.js');

let self = module.exports = {
  alias: ['edrake'],
  
  desc: 'Generate a dank memay with emoji',

  args: '"Top Text" "Bottom Text"',

  execute: (client, msg, args) => {
    if (args.length < 2) return core.err.args(msg);

    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    memeText = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

    try {
      var text1 = memeText[0].replace(/['"]+/g, ''); // Shitty quote removal
      var text2 = memeText[1].replace(/['"]+/g, '');
    } catch (e) {
      console.log('args error: \n' + e);
      return msg.channel.send('Small **oof** my dude check your quotes').catch(err => core.err.dead(msg, err));
    }

    let meme = `<:drakeno:420253513239494657> ${text1} \n<:drakeyes:420253514116104198> ${text2}`; // ids need to change if emoji deleted from csit++

    msg.channel.send(meme).catch(err => core.err.dead(msg, err));
    msg.delete().catch(console.error);
  }
}
