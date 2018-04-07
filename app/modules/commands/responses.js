const Discord = require('discord.js'),
      core = require('../core.js');

let self = module.exports = {
  alias: ['settings'],

  desc: 'List/Change current settings for the bot.',

  args: '[change] [settingName] [value]',
  
  execute(client, msg, args) {
    if (!args.length) return self.list(client, msg);
  
    if (self[args[0]]) return self[args[0]](client, msg, args[1], args[2]); // surely this shouldn't work lmao - ghetto as fuck for running function from argument
  
    return core.err.reply(msg, 'err that\'s not a thing mongo');
  },

  list(client, msg) {
    let chunk = 25;
    let fields = [];
    let guild = core.server.get(client, msg.guild);
    let reply = `I don't have any responses yet my dude, you can add some using \`${guild.prefix}add "trigger" "response"\``

    msg.delete().then().catch(console.error);

    for (let res in guild.responses) {
      if (!guild.responses.hasOwnProperty(res)) break;

      let trigger = guild.responses[res], author  = '';
      
      if (trigger.author) author = `\n*(added by ${client.users.get(trigger.author)})*` || ''; // fallback for old style responses without author

      fields.push({ name: '\u200B', value: `**${res}**\n${trigger.response || trigger}${author}` });
    }

    for (let i = 0; i < fields.length; i += chunk) {
      let embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username}'s Responses`, client.user.avatarURL)
        .setColor(3447003);

      embed.fields = fields.slice(i , i + chunk);

      if (embed.fields.length) reply = { embed };

      msg.channel.send(reply).catch(err => core.err.dead(msg, err));
    }
  },

  add(client, msg, args) {
    if (args.length < 2) return core.err.args(msg);
    
    let server = core.server.get(client, msg.guild);
    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    let text = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

    try {
      var trigger = text[0].replace(/['"]+/g, ''); // Shitty quote removal
      var response = text[1].replace(/['"]+/g, '');
    } catch (e) {
      console.log('args error: \n' + e);
      return msg.channel.send('Small **oof** my dude check your quotes').catch(err => core.err.dead(msg, err));
    }

    if (server.responses[trigger]) return msg.channel.send('be more original - trigger already exists').catch(err => core.err.dead(msg, err));
    
    server.responses[trigger] = {
      response: response,
      author: msg.author.id
    }

    core.server.set(client, msg.guild.id, server);

    msg.channel.send('*I\'ll remember that*').catch(err => core.err.dead(msg, err));
  },

  remove(client, msg, args) {
    if (!args.length) return core.err.args(msg, 1);
    
    let server = core.server.get(client, msg.guild);
    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    let text = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

    try {
      var trigger = text[0].replace(/['"]+/g, ''); // Shitty quote removal
    } catch (e) {
      console.log('args error: \n' + e);
      return msg.channel.send('Small **oof** my dude check your quotes');
    }

    if (!server.responses[trigger]) return msg.channel.send('couldn\'t find that trigger, maybe learn to spell?').catch(err => core.err.dead(msg, err));

    delete server.responses[trigger];

    core.server.set(client, msg.guild.id, server);

    msg.channel.send(`I've removed \`${trigger}\` from your responses`).catch(err => core.err.dead(msg, err));
  },
  
  reset(client, msg) {
    // if (!core.roles.daddy(msg.author.id)) return core.err.perms(msg);
  
    // core.server.new(client, msg.guild, server => {
    //   msg.reply(`I've reset your shit`).catch(err => core.err.dead(msg, err));
    // });
  },
  
  migrate(client, msg) {
    // if (!core.roles.daddy(msg.author.id)) return core.err.perms(msg);
  
    // client.guilds.map(guild => {
    //   let server = core.server.get(client, guild);
    //   let settings = core.server.default(client, guild);
  
    //   for (let option in settings) {
    //     if (!(option in server)) server[option] = settings[option];
    //   }
  
    //   core.server.set(client, msg.guild.id, server);
    // });
  
    // msg.reply('yup that should be all good now').catch(err => core.err.dead(msg, err));
  },
}
