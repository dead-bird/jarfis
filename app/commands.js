require('dotenv').config({ path: '.env' });

const settings = require('./settings.js'),
  Discord = require('discord.js'),
  core = require('./core.js'),
  request = require('request');
(fs = require('fs')), (env = process.env);

let self = (module.exports = {
  help: {
    // When we get above 25 commands will need to add pagination or some other method as embed limit is 25 fields
    desc: 'Lists all available commands.',
    args: 'none',
    execute: (client, msg) => {
      let pf = core.server.get(client, msg.guild).prefix;

      let embed = new Discord.RichEmbed()
        .setAuthor('command me daddy', client.user.avatarURL)
        .setColor(3447003);

      for (var cmd in module.exports) {
        if (cmd)
          embed.addField(
            '\u200B',
            `**${pf}${cmd}** *${module.exports[cmd].args}*\n${
              module.exports[cmd].desc
            }`
          );
      }

      embed.setFooter(
        `Above is a list of our bois commands. Arguments (such as | word) that are in brackets for commands are optional. Make sure to include the space or the bot wont treat | as a seperator :)`
      );

      msg
        .delete()
        .then()
        .catch(console.error);
      msg.channel.send({ embed });
    },
  },
  settings: {
    desc: 'List/Change current settings for the bot.',
    args: '[change] [settingName] [value]',
    execute: (client, msg, args) => {
      if (!args)
        return core.err.reply(msg, 'yo dawg i need a bit more than that');
      settings.execute(client, msg, args);
    },
  },
  loc: {
    desc: "Returns the bot's environment.",
    args: '',
    execute: (client, msg) => {
      msg.channel.send(`chillin' at ${env.LOC}`);
      client.user.setPresence({ game: { name: `in ${env.LOC}`, type: 0 } });
    },
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    valid: i => i >= 0 && i <= 5,
    execute: (client, msg, args) => {
      if (!args) return core.err.args(msg, 1);
      let rate = Math.floor(args[0]);

      if (!self.r.valid(rate))
        return msg.reply("gimme dat fatty number between 0-5 ya'dig"); // add to error handler

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel
        .send(msg.member.nickname || msg.author.username, {
          file: `app/resources/responses/rate/${rate}.png`,
        })
        .catch(err => core.err.dead(msg, err));
    },
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string>',
    execute: (client, msg, args) => {
      let name = args[0];

      msg.guild
        .member(client.user)
        .setNickname(name)
        .then(() => {
          msg.channel.send(`just call me ${name}`);
        })
        .catch(err => core.err.dead(msg, err));
    },
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: 'none',
    execute: (client, msg) => {
      msg.guild
        .member(client.user)
        .setNickname('Jarfis')
        .then(() => {
          msg.channel.send(
            `reverting to Jarfis. Don't fuck me up again I'm a soft boy`
          );
        })
        .catch(err => core.err.dead(msg, err));
    },
  },
  flip: {
    desc: 'Flip a coin. Can also use custom emotes the bot can access',
    args: 'none ( heads | tails )',
    execute: (client, msg, args) => {
      //Default flips
      let heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif';
      let tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif';
      let headExt = 'png';
      let tailExt = 'png';

      if (args[0] && args[1]) {
        let headEmote = args[0].match(/:.+:((\d+){10,})>/); //if 2 args and match emote format
        let tailEmote = args[1].match(/:.+:((\d+){10,})>/);

        if (args[0].substring(1, 2) === 'a') {
          headExt = 'gif';
        }
        if (args[1].substring(1, 2) === 'a') {
          tailExt = 'gif';
        }

        if (headEmote !== null) {
          heads = `https://cdn.discordapp.com/emojis/${
            headEmote[1]
          }.${headExt}`;
        }
        if (tailEmote !== null) {
          tails = `https://cdn.discordapp.com/emojis/${
            tailEmote[1]
          }.${tailExt}`;
        }
      }

      let res = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';
      let embed = new Discord.RichEmbed()
        .setColor(res === 'heads' ? '3232ff' : 'FFD700')
        .setTitle(`it's ${res} motherfucker`)
        .setImage(res === 'heads' ? heads : tails)
        .addBlankField(true);

      msg.channel.send({ embed });
    },
  },
  rc: {
    desc: 'RaNCApS YOUR TeXt.',
    args: '<string>',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let str = args[0];

      function tweak(c) {
        return Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase();
      }

      str = str
        .split('')
        .map(tweak)
        .join('');

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },
  clear: {
    desc: 'Hide the edge.',
    args: 'none',
    execute: (client, msg) => {
      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(
        '.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n+--------+\n+**CLEAR**+\n+--------+'
      );
    },
  },
  think: {
    desc: 'Shows a random thinking emoji',
    args: 'none',
    execute: (client, msg) => {
      let filePath = './app/resources/responses/think/';

      fs.readdir(filePath, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let r = Math.floor(Math.random() * data.length);
          let selection = filePath + data[r];

          msg
            .delete()
            .then()
            .catch(console.error);

          msg.channel
            .send({ file: selection })
            .catch(err => core.err.dead(msg, err));
        }
      });
    },
  },
  echo: {
    desc: "Speak on Jarfis' behalf.",
    args: '<string>',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let str = args[0];

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },

  // Bans
  ban: {
    desc: 'Stop people *cough* Ramon *cough* from issuing commands',
    args: '@user',
    execute: (client, msg, args) => {
      let id = core.user.findId(args[0]);
      let user = core.user.get(client, id);

      if (id === core.csit) return msg.channel.send(`you cannot ban the 👑`);

      if (id === msg.author.id)
        return msg.channel.send(`you gonna ban yerself dickhead`);

      if (user.banned)
        return msg.channel.send(`<@${id}> is already banned my dude`);

      user.banned = true;

      client.losers.set(id, user);

      msg.channel
        .send(`<@${id}> is now banned`)
        .catch(err => core.err.dead(msg, err));
    },
  },
  unban: {
    desc: "For when you've had enough :dsd: for one day",
    args: '@user',
    execute: (client, msg, args) => {
      let id = core.user.findId(args[0]);
      let user = core.user.get(client, id);

      if (!user.banned)
        return msg.channel.send(`<@${id}> isn't even banned you ***idiot***`);

      user.banned = false;

      client.losers.set(id, user);

      msg.channel
        .send(`<@${id}> is now unbanned`)
        .catch(err => core.err.dead(msg, err));
    },
  },

  // Responses
  add: {
    desc: 'Add a trigger and response to the bot',
    args: 'Trigger | Response',
    execute: (client, msg, args) => {
      if (!args || args.length < 2) return core.err.args(msg);

      let server = core.server.get(client, msg.guild);

      try {
        var trigger = args[0];
        var response = args[1];
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel
          .send('Small **oof** my dude check your formatting')
          .catch(err => core.err.dead(msg, err));
      }

      if (server.responses[trigger])
        return msg.channel
          .send('be more original - trigger already exists')
          .catch(err => core.err.dead(msg, err));

      server.responses[trigger] = {
        response: response,
        author: msg.author.id,
      };

      core.server.set(client, msg.guild.id, server);

      msg.channel
        .send("*I'll remember that*")
        .catch(err => core.err.dead(msg, err));
    },
  },
  remove: {
    desc: 'Delete a trigger and response from the bot',
    args: 'Trigger',
    execute: (client, msg, args) => {
      if (!args) return core.err.args(msg, 1);

      let server = core.server.get(client, msg.guild);

      try {
        var trigger = args[0];
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel.send('Small **oof** my dude check your formatting');
      }

      if (!server.responses[trigger])
        return msg.channel
          .send("couldn't find that trigger, maybe learn to spell?")
          .catch(err => core.err.dead(msg, err));

      delete server.responses[trigger];

      core.server.set(client, msg.guild.id, server);

      msg.channel
        .send(`I've removed \`${trigger}\` from your responses`)
        .catch(err => core.err.dead(msg, err));
    },
  },
  responses: {
    desc: 'List all the triggers and responses written to the bot',
    args: 'none',
    execute: (client, msg) => {
      let chunk = 25;
      let fields = [];
      let guild = core.server.get(client, msg.guild);
      let reply = `I don't have any responses yet my dude, you can add some using \`${
        guild.prefix
      }add trigger | response\``;

      msg
        .delete()
        .then()
        .catch(console.error);

      for (let res in guild.responses) {
        if (!guild.responses.hasOwnProperty(res)) break;

        let trigger = guild.responses[res],
          author = '';

        if (trigger.author)
          author = `\n*(added by ${client.users.get(trigger.author)})*` || ''; // fallback for old style responses without author

        fields.push({
          name: '\u200B',
          value: `**${res}**\n${trigger.response || trigger}${author}`,
        });
      }

      for (let i = 0; i < fields.length; i += chunk) {
        let embed = new Discord.RichEmbed()
          .setAuthor(
            `${client.user.username}'s Responses`,
            client.user.avatarURL
          )
          .setColor(3447003);

        embed.fields = fields.slice(i, i + chunk);

        if (embed.fields.length) reply = { embed };

        msg.channel.send(reply).catch(err => core.err.dead(msg, err));
      }
    },
  },
  clap: {
    desc: ':clap:get:clap:your:clap:point:clap:across:clap:',
    args: '<string> ( | raw )',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let clap = ':clap:';

      if (args[1] === 'raw') {
        clap = '\\👏';
        args.splice(1, 1);
      }

      let str = clap; // Prepend a clap

      preClap = args[0].split(/ /g);

      preClap.forEach(arg => {
        str += arg + clap;
      });

      msg
        .delete()
        .then()
        .catch(console.error);
      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },
  banner: {
    desc: 'Turn your text into 🇪 🇲 🇴 🇯 🇮',
    args: '<string> A-Z and 0-9',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let numStr = [
        ':zero:',
        ':one:',
        ':two:',
        ':three:',
        ':four:',
        ':five:',
        ':six:',
        ':seven:',
        ':eight:',
        ':nine:',
      ];
      let a = args[0]
        .toLowerCase()
        .replace(/([a-z])/g, ':regional_indicator_$1: ')
        .replace(/([0-9])/g, $1 => numStr[$1]);

      msg.delete().catch(console.error);
      msg.channel.send(a).catch(err => core.err.dead(msg, err));
    },
  },
  spam: {
    desc: 'spam',
    args: 'spam',
    execute: (client, msg, args) => {
      msg.delete().catch(console.error);
      if (!args) return core.err.empty(msg);

      for (i = 0; i < 5; i++) {
        msg.channel.send(args[0]).catch(err => core.err.dead(msg, err));
      }
    },
  },
  drake: {
    desc: 'Generate a dank memay with emoji',
    args: 'Top Text | Bottom Text',
    execute: (client, msg, args) => {
      if (!args || args.length < 2) return core.err.args(msg);

      try {
        var text1 = args[0];
        var text2 = args[1];
      } catch (e) {
        console.log('args error: \n' + e);
        return msg.channel
          .send('Small **oof** my dude check your formatting')
          .catch(err => core.err.dead(msg, err));
      }

      let meme = `<:drakeno:420253513239494657> ${text1} \n<:drakeyes:420253514116104198> ${text2}`; // ids need to change if emoji deleted from csit++

      msg.channel.send(meme).catch(err => core.err.dead(msg, err));
      msg.delete().catch(console.error);
    },
  },
  insult: {
    desc: '@ me',
    args: '@user',
    execute: (client, msg, args) => {
      if (!args)
        return msg.reply(`Small **oof** my dude I need someone to insult`);
      let user = args[0].match(/<@\!?\d*>/g);

      if (!user)
        return msg.reply(`Small **oof** my dude *${args[0]}* isnt a user`);
      let insults = fs
        .readFileSync(`${__dirname}/data/insults.txt`)
        .toString()
        .split('\n');
      let selectedInsult = insults[Math.floor(Math.random() * insults.length)];

      msg.channel.send(`${user} you ${selectedInsult}`);
    },
  },
  heist: {
    desc:
      'This is a frickin stickup :gun:<:111:452594414011940874><:222:452594414058078218>',
    args: '( emoji | emoji ) | text',
    execute: (client, msg, args) => {
      if (!args) {
        var args = [];
        args[0] = '<:111:452594414011940874><:222:452594414058078218>';
        args[1] = '...';
      }

      try {
        var emoji = args[0];
        var speech = args[1];
      } catch (e) {
        console.log(text);
        console.log('args error: \n' + e);
        return msg.channel
          .send('Small **oof** my dude check your formatting')
          .catch(err => core.err.dead(msg, err));
      }
      let heistMsg = `<:space:499933777749868546><:space:499933777749868546>( ${speech}  )\n<:space:499933777749868546><:space:499933777749868546>◞\n🔫${emoji}`;
      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(heistMsg).catch(err => core.err.dead(msg, err));
    },
  },
  oob: {
    desc: 'oobify yooboobr toobxt',
    args: 'text',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let str = args[0].replace(/[aeiou]/gi, 'oob');

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },
  pins: {
    desc: "Check that dyl isn't making Jarfis lie again",
    args: '',
    execute: (client, msg) => core.newPin(msg.channel),
  },
  ss: {
    desc: 'superspoiler your shit',
    args: 'text ( | raw | letter)',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let str = `||${args[0]}||`.replace(/ /gi, '|| ||');

      for (let i = 1; i < args.length; i++) {
        //Not forEach to skip the first arg??
        arg = args[i];
        switch (arg) {
          case 'raw':
            str = `\`\`\`${str}\`\`\``;
            break;
          case 'letter':
            str = str.slice(2, -2).replace(/([^| ])/gi, '||$1||');
            break;
          default:
            break;
        }
      }

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },
});

//                                              ____________
//                               --)-----------|____________|
//                                             ,'       ,'
//               -)------========            ,'  ____ ,'
//                        `.    `.         ,'  ,'__ ,'
//                          `.    `.     ,'       ,'
//                            `.    `._,'_______,'__
//                              [._ _| ^--      || |
//                      ____,...-----|__________ll_|\
//     ,.,..-------"""""     "----'                 ||
// .-""  |=========================== ______________ |
//  "-...l_______________________    |  |'      || |_]
//                               [`-.|__________ll_|
//                             ,'    ,' `.        `.
//                           ,'    ,'     `.    ____`.
//               -)---------========        `.  `.____`.
//                                            `.        `.
//                                              `.________`.
//                              --)-------------|___________|
