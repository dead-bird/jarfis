const core = require('../core.js');

let self = module.exports = {
  alias: ['flip'],
  
  desc: 'Flip a coin.',

  args: '',

  execute: (client, msg) => { // Should be more modular and less shit
    let heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif';
    let tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif';
    let res = (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
    let embed = new Discord.RichEmbed()
      .setColor((res === 'heads' ? '3232ff' : 'FFD700'))
      .setTitle(`it's ${res} motherfucker`)
      .setThumbnail((res === 'heads' ? heads : tails))
      .addBlankField(true);

    msg.channel.send({embed});
  }
}
