const core = require('../core.js');

let self = module.exports = {
  alias: ['help'],
  
  desc: 'Lists all available commands.',

  args: '',

  execute: (client, msg) => {
    let pf = core.server.get(client, msg.guild).prefix;

    let embed = new Discord.RichEmbed().setAuthor('command me daddy', client.user.avatarURL).setColor(3447003)
    
    for (var cmd in module.exports) {
      if (cmd) embed.addField('\u200B', `**${pf}${cmd} ${module.exports[cmd].args}**\n${module.exports[cmd].desc}`);
    }
    
    msg.delete().then().catch(console.error);
    msg.channel.send({embed});
  },
}
