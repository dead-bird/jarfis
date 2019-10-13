require('dotenv').config({ path: '.env' });

const penis = require('./resources/penis');
const space = require('./resources/space');
const settings = require('./settings.js');
const Discord = require('discord.js');
const core = require('./core.js');
const axios = require('axios');
const fs = require('fs');

env = process.env;

let self = (module.exports = {
  help: {
    desc: 'Lists all available commands.',
    execute: (client, msg) => {
      // Array to split long message into batches
      let splitMsgs = [];
      let generatedMsg = '';

      // Markup to look pretty
      let muStart = '```asciidoc\n';
      let muEnd = '```';

      for (var cmd in module.exports) {
        // If length close to char limit split message and reset
        if (generatedMsg.length > 1800) {
          splitMsgs.push(generatedMsg);
          generatedMsg = '';
          cmdstr = '';
        }

        if (cmd) {
          let args = '';
          if (module.exports[cmd].args) {
            args = `= ${module.exports[cmd].args}\n`;
          }
          // Build message content with markup
          cmdstr = `!${cmd} :: ${module.exports[cmd].desc}\n${args}\n`;
          generatedMsg += cmdstr;
        }
      }
      // Push final message to array post splitting
      splitMsgs.push(generatedMsg);

      helpOutro =
        "`Above is a list of our bois commands. Arguments (such as '| word') that are in brackets for commands are optional. Make sure to include the space or the bot wont treat | as a seperator\n`";

      msg
        .delete()
        .then()
        .catch(console.error);

      // New issue when this array gets to 4 as api limiting :)
      splitMsgs.forEach(generatedMsg => {
        str = muStart + generatedMsg + muEnd;
        msg.author.send(str);
      });
      msg.author.send(helpOutro);
      msg.channel
        .send(
          `${msg.author.username}, peep your dm's chief. I've told you how you can use me uwu 😛`
        )
        .then(msg => {
          msg.delete(5000);
        })
        .catch(err => core.err.dead(msg, err));
    },
  },
  settings: {
    desc: 'List/Change current settings for the bot.',
    args: '[change] [settingName] [value]',
    execute: (client, msg, args) => {
      settings.execute(client, msg, args);
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
        return msg.reply(`gimme dat fatty number between 0-5 ya'dig`); // Add to error handler

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
  reset: {
    desc: 'Resets the name of the bot.',
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
      let useCustom = true;
      if (!args || args.length < 2) {
        useCustom = false;
      }
      // Default flips
      let heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif';
      let tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif';
      let headExt = 'png';
      let tailExt = 'png';

      if (useCustom) {
        let headEmote = args[0].match(/:.+:((\d+){10,})>/); // If 2 args and match emote format
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

      let str = args.join(' ');

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
    execute: (client, msg) => {
      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(space);
    },
  },
  think: {
    desc: 'Shows a random thinking emoji',
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
    desc: `Speak on Jarfis' behalf.`,
    args: '<string>',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(args.join(' ')).catch(err => core.err.dead(msg, err));
    },
  },

  // Bans
  ban: {
    desc: 'Stop people *cough* Ramon *cough* from issuing commands',
    args: '(@user) or (list)',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      if (args[0] === 'list') {
        let reply = 'only good bois around these parts :cowboy:';

        let banned = msg.guild.members.reduce((carry, member) => {
          if (!member.user.bot && core.user.get(client, member.id).banned) {
            carry.push(member.nickname || member.username);
          }

          return carry;
        }, []);

        if (banned.length) {
          reply = '**Nuaghty Bois 🤪**\n\n';

          banned.forEach(ban => {
            reply += `- ${ban}\n`;
          });
        }

        return msg.channel.send(reply);
      }

      if (!args[0].match(core.regex.userId))
        return msg.channel.send(`Look fam that's not even a real person`);

      let id = core.user.findId(args[0]);

      if (id === core.csit) return msg.channel.send(`you cannot ban the 👑`);
      if (id === msg.author.id)
        return msg.channel.send(`you gonna ban yerself dickhead`);

      let user = core.user.get(client, id);

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
    desc: `For when you've had enough :dsd: for one day`,
    args: '@user',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);
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
    args: 'Trigger | Response (| delete)',
    execute: (client, msg, args) => {
      if (!args || args.length < 2) return core.err.args(msg);

      let server = core.server.get(client, msg.guild);

      let selfDestruct = typeof args[2] !== 'undefined';

      try {
        var trigger = args[0].toLowerCase();
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
        destruct: selfDestruct,
      };

      core.server.set(client, msg.guild.id, server);

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send("*I'll remember that*").then(msg => {
        msg.delete(3000).catch(err => core.err.dead(msg, err));
      });
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
          .send(`couldn't find that trigger, maybe learn to spell?`)
          .catch(err => core.err.dead(msg, err));

      delete server.responses[trigger];

      core.server.set(client, msg.guild.id, server);

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel
        .send(`I've removed \`${trigger}\` from your responses`)
        .catch(err => core.err.dead(msg, err));
    },
  },
  responses: {
    desc: 'List all the triggers and responses written to the bot',
    execute: (client, msg) => {
      let guild = core.server.get(client, msg.guild);

      // Markup to look pretty
      let muStart = '```diff\n';
      let muEnd = '```';

      let responses = [];
      let splitMsgs = [];
      let generatedMsg = '';

      for (let res in guild.responses) {
        if (res && !guild.responses.hasOwnProperty(res)) break;

        let trigger = guild.responses[res];
        let author = '';
        let destruct = guild.responses[res].destruct;

        // Fallback for old style responses without author
        if (trigger.author) {
          const user = client.users.get(trigger.author) || {};
          author = user.username || '';
        }

        let newlineRegex = /\r?\n|\r/g;
        let fuckyChars = /\*|_|`|\||~/g;

        let response = core.msg.replace.userId(trigger.response, client);

        response = core.msg.replace
          .emotes(response)
          .replace(newlineRegex, ' ')
          .replace(fuckyChars, '')
          .substring(0, 30);

        if (response > 30) response += '...';

        res = core.msg.replace.userId(res, client);

        responses.push({
          trigger: core.msg.replace.emotes(res),
          response,
          author,
          destruct,
        });
      }

      responses.forEach(res => {
        msgLength =
          generatedMsg.length +
          res.trigger.length +
          res.author.length +
          res.response.length;

        if (msgLength > 1950) {
          splitMsgs.push(generatedMsg);
          generatedMsg = '';
          cmdstr = '';
        }

        if (res.destruct === true || undefined) {
          cmdstr = `- ${res.trigger} - ${res.response} - ${res.author}\n`;
        } else {
          cmdstr = `+ ${res.trigger} - ${res.response} - ${res.author}\n`;
        }

        generatedMsg += cmdstr;
      });

      splitMsgs.push(generatedMsg);

      msg
        .delete()
        .then()
        .catch(console.error);

      splitMsgs.forEach(generatedMsg => {
        str = muStart + generatedMsg + muEnd;
        msg.author.send(str);
      });

      msg.author.send(
        `\`Above are all of the responses I have for ${msg.guild.name} :) red ones delete the trigger when invoked whilst green ones persist. \``
      );

      msg.channel
        .send(
          `${msg.author.username}, I've slid in your dms with my responses 😛`
        )
        .then(msg => {
          msg.delete(3000);
        })
        .catch(err => core.err.dead(msg, err));
    },
  },
  clap: {
    desc: '👏get👏your👏point👏across👏',
    args: '<string> ( | emoji | raw )',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let spacer = '👏';
      let escape = false;

      // Start at fucky loop index to ignore message arg
      for (let i = 1; i < args.length; i++) {
        // Not sure best way to do this logic D:
        if (args[i] === 'raw') {
          escape = true;
        } else {
          spacer = args[i];
        }
      }

      if (escape) {
        spacer = '\\' + spacer;
      }

      let str = spacer; // Prepend a ting

      preClap = args[0].split(/ /g);

      preClap.forEach(arg => {
        str += arg + spacer;
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
    args: 'string (| raw)',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let rawTxt = args[0].split('');
      let escape = '';
      let reply = '';
      let chars = {
        a: '🇦',
        b: '🇧',
        c: '🇨',
        d: '🇩',
        e: '🇪',
        f: '🇫',
        g: '🇬',
        h: '🇭',
        i: '🇮',
        j: '🇯',
        k: '🇰',
        l: '🇱',
        m: '🇲',
        n: '🇳',
        o: '🇴',
        p: '🇵',
        q: '🇶',
        r: '🇷',
        s: '🇸',
        t: '🇹',
        u: '🇺',
        v: '🇻',
        w: '🇼',
        x: '🇽',
        y: '🇾',
        z: '🇿',
        1: '1⃣',
        2: '2⃣',
        3: '3⃣',
        4: '4⃣',
        5: '5⃣',
        6: '6⃣',
        7: '7⃣',
        8: '8⃣',
        9: '9⃣',
        0: '0⃣',
      };

      if (args[1]) {
        escape = '\\';
      }

      rawTxt.forEach(letter => {
        if (chars[letter]) {
          reply += `${escape + chars[letter]} `;
        } else {
          reply += ' '; // Idk how to not get undefined putting this as char || ''
        }
      });

      msg.delete().catch(console.error);
      msg.channel.send(reply).catch(err => core.err.dead(msg, err));
    },
  },
  spam: {
    desc: 'spam',
    args: '<string>',
    execute: (client, msg, args) => {
      msg.delete().catch(console.error);
      if (!args) return core.err.empty(msg);
      let reps = 5;

      str = args.join(' ') + '\n';
      str = str.repeat(reps);

      if (str.length > 2000 / reps) {
        return msg.channel
          .send('***yoinkz*** thats a bit *too* much text to spam there pal')
          .catch(err => core.err.dead(msg, err));
      }

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
      msg.channel.send(str).catch(err => core.err.dead(msg, err));
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

      let meme = `<:drakeno:420253513239494657> ${text1} \n<:drakeyes:420253514116104198> ${text2}`; // Ids need to change if emoji deleted from csit++

      msg.channel.send(meme).catch(err => core.err.dead(msg, err));
      msg.delete().catch(console.error);
    },
  },
  insult: {
    desc: 'Make someone cry',
    args: '@user',
    execute: (client, msg, args) => {
      const prefix = 'Small **oof** my dude';

      if (!args) return msg.reply(`${prefix} I need someone to insult`);

      let user = args[0].match(core.regex.userId);

      if (!user) return msg.reply(`${prefix} *${args[0]}* isnt a user`);

      axios
        .get('https://api.antagonize.deadbird.dev/insult')
        .then(res => msg.channel.send(`${user} you ${res.data.text}`))
        .catch(e => console.error(e));
    },
  },
  heist: {
    desc: 'This is a frickin stickup 🔫',
    args: 'text ( | emoji )',
    execute: (client, msg, args = []) => {
      if (!args || args.length < 2) {
        args[0] = args[0] || '...';
        args[1] =
          args[1] || '<:111:452594414011940874><:222:452594414058078218>';
      }

      try {
        var speech = args[0];
        var emoji = args[1];
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

      let str = args.join(' ').replace(/[aeiou]/gi, 'oob');

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(str).catch(err => core.err.dead(msg, err));
    },
  },
  pins: {
    desc: `Check that dyl isn't making Jarfis lie again`,
    execute: (client, msg) => core.announcePins(msg.channel),
  },
  ss: {
    desc: 'superspoiler your shit',
    args: 'text ( | raw | letter)',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      let str = `||${args[0]}||`.replace(/ /gi, '|| ||');

      for (let i = 1; i < args.length; i++) {
        // Not forEach to skip the first arg??
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
  swap: {
    desc: 'substitute text',
    args: 'string | find | replace',
    execute: (client, msg, args) => {
      if (!args || args.length < 3) return core.err.empty(msg);
      // Escape regex chars
      args[1] = args[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let re = new RegExp(args[1], 'g');

      reply = args[0].replace(re, args[2]);

      msg
        .delete()
        .then()
        .catch(console.error);
      msg.channel.send(reply).catch(err => core.err.dead(msg, err));
    },
  },
  cry: {
    desc: 'cry-ify you,,r texxytt withh a.,pcry',
    args: 'string',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      // Strip emote spam for now until we have better func in place
      str = core.msg.replace.emotes(args[0]);

      msg
        .delete()
        .then()
        .catch(console.error);

      axios
        .get(`${env.APCRY + encodeURI(str)}`)
        .then(res => {
          if (res.data.status === 200) {
            msg.channel
              // Escape MD chars
              .send(core.msg.escape(res.data.tears))
              .catch(err => core.err.dead(msg, err));
          }
        })
        .catch(e => console.error(e));
    },
  },
  penis: {
    desc: "it's time for a dickin'!",
    args: 'string',
    execute: (client, msg, args) => {
      if (!args) return core.err.empty(msg);

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel
        .send(penis.replace(/\<penis\>/gm, args[0]))
        .catch(err => core.err.dead(msg, err));
    },
  },
  np: {
    desc: 'Shows your now playing if available',
    execute: async (client, msg, args) => {
      let author = msg.author;
      if (args && args[0]) {
        try {
          author = await client.fetchUser(
            args[0].replace(core.regex.userId, '$1')
          );
        } catch (e) {
          console.log('args error: \n' + e);
          return msg.channel.send(
            'Small **oof** my dude check your formatting'
          );
        }
      }

      let presence = author.presence ? author.presence.game : '',
        user = author.username;

      msg
        .delete()
        .then()
        .catch(console.error);

      if (presence && presence.name === 'Spotify') {
        str = `🎵 - ${user} is now listening to ${presence.details}\n https://open.spotify.com/track/${presence.syncID}`;
        msg.channel.send(str).catch(err => core.err.dead(msg, err));
      } else {
        msg.channel
          .send(
            `<a:fortnite:491257645823688714> ${user}, sorry bro I can't tell if you're jamming or not :(`
          )
          .catch(err => core.err.dead(msg, err));
      }
    },
  },
  tf: {
    desc: 'transform arg 1 into arg 2',
    args: 'arg1 | arg2',
    execute: (client, msg, args) => {
      if (!args || args.length < 2) return core.err.args(msg);

      msg
        .delete()
        .then()
        .catch(console.error);

      msg.channel.send(
        `:hand: ${args[0]} :dnah:\n:space::toem:\n:palm: ${args[1]} :mlap:`
      );
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
