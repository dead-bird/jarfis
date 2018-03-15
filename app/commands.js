require('dotenv').config({path: '.env'});

const Discord = require('discord.js'),
      fs      = require('fs'),
      request = require('request');
      env     = process.env;

let self = module.exports = {
  help: { // When we get above 25 commands will need to add pagination or some other method as embed limit is 25 fields
    desc: 'Lists all available commands.',
    args: '',
    execute: (client, msg) => {
      msg.delete().then().catch(console.error);

      let embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setDescription(':information_source: here are my commands')
        .setThumbnail(client.user.avatarURL) // Bot's avatar
        .addBlankField(true);

      for (var command in module.exports) {
        if (command) {
          embed.addField(`!${command} ${module.exports[command].args}`, module.exports[command].desc);
        }
      }

      msg.channel.send({embed});
    }
  },
  loc: {
    desc: 'Returns the bot\'s environment.',
    args: '',
    execute: (client, msg) => {
      msg.channel.send(`chillin' at ${env.LOC}`);
      client.user.setPresence({game: {name: `in ${env.LOC}`, type: 0}});
    }
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    valid: (i) => {
      return i >= 0 && i <= 5;
    },
    execute: (client, msg, args) => {
      if (!self.r.valid(args[1])) return msg.reply('gimme dat fatty number between 0-5 ya\'dig');

      msg.delete().then().catch(console.error);

      msg.channel.send(msg.member.nickname || msg.author.username, {
        file: `app/resources/responses/rate/${args[1]}.png`
      });
    }
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string: no spaces... for now>',
    execute: (client, msg, args) => {
      let newName = '';

      for (let i = 1; i < args.length; i++) {
        newName += args[i] + ' ';
      }

      msg.guild.member(client.user).setNickname(newName).then(function () {
        let bot = (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);
        msg.channel.send(`just call me ${bot}`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`));
    }
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: '',
    execute: (client, msg) => {
      msg.guild.member(client.user).setNickname('Jarfis').then(function () {
        msg.channel.send(`reverting to Jarfis. Don't fuck me up again I'm a soft boy`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`));
    }
  },
  flip: {
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
  },
  rc: {
    desc: 'RaNCApS YOUR TeXt.',
    args: '<string>',
    execute: (client, msg, args) => {
      let str = '';
      let i = 0;

      for (i; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + ' ';
        }
      }

      let a = str.split('');
      let n = a.length;

      for (i = n - 1; i >= 0; i--) {
        let r = Math.floor(Math.random() * n) + 1;
        a[r] = (a[r] ? a[r].toUpperCase() : '');
      }

      msg.delete().then().catch(console.error);

      msg.channel.send(a.join(''));
    }
  },
  clear: {
    desc: 'Hide the edge.',
    args: '',
    execute: (client, msg) => {
      msg.delete().then().catch(console.error);

      msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
    }
  },
  think: {
    desc: 'Shows a random thinking emoji',
    args: '',
    execute: (client, msg) => {
      let filePath = './app/resources/responses/think/';

      fs.readdir(filePath, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let r = Math.floor(Math.random() * data.length);
          let selection = filePath + data[r];

          msg.delete().then().catch(console.error);

          msg.channel.send({
            file: selection
          });
        }
      });
    }
  },
  echo: {
    desc: 'Speak on Jarfis\' behalf.',
    args: '<string>',
    execute: (client, msg, args) => {
      let str = '';

      for (let i = 0; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + ' ';
        }
      }

      msg.delete().then().catch(console.error);

      msg.channel.send(str);
    }
  },
  ban: {
    desc: 'Stop people *cough* Ramon *cough* from issuing commands',
    args: '<user>',
    execute: (client, msg, args) => {
      let path = `${__dirname}/data/guilds/${msg.guild.id}/banlist.json`;

      if (args[1].match(/(<@!\d*>|<@\d*>)/g)) {
        let banList = fs.readFileSync(path, 'utf8');
        let id = args[1].match(/\d+/g).toString();

        if (banList) {
          let aBanList = JSON.parse(banList);
          aBanList.push(id);
          let banned = (JSON.stringify(aBanList));

          fs.writeFileSync(path, banned, err => {
            if (err) {
              throw err;
            }
          });

          msg.channel.send(`<@${id}> is now banned`);
        } else {
          let firstUser = `["${id}"]`;

          fs.writeFileSync(path, firstUser, err => {
            if (err) {
              throw err;
            }
          });
          msg.channel.send(`<@${id}> is now banned`);
        }
      } else {
        // Not super useful message but at least it doesnt crash
        msg.channel.send(`Something went wrong`);
      }
    }
  },
  unban: {
    desc: 'For when you\'ve had enough :dsd: for one day',
    args: '<user>',
    execute: (client, msg, args) => {
      let path = `${__dirname}/data/guilds/${msg.guild.id}/banlist.json`;

      if (args[1].match(/(<@!\d*>|<@\d*>)/g)) {
        let banList = fs.readFileSync(path, 'utf8');
        let id = args[1].match(/\d+/g).toString();

        if (banList) {
          let aBanList = JSON.parse(banList);

          for (let i = 0; i < aBanList.length; i++) {
            if (aBanList[i] === id) {
              aBanList.splice(i, 1);
              fs.writeFileSync(path, JSON.stringify(aBanList), err => {
                if (err) {
                  throw err;
                }
              });

              msg.delete().then().catch(console.error);
              msg.channel.send(`<@${id}> is now unbanned`);

              return true;
            }
          }

          msg.delete().then().catch(console.error);
          msg.channel.send(`Awkward, <@${id}> doesnt seem to be banned`);
        }
      } else {
        // Not super useful message but at least it doesnt crash
        msg.channel.send(`Something went wrong`);
      }
    }
  },
  // addResp: {
  //   desc: 'Add a trigger and response to the bot',
  //   args: '"<Trigger:string>", "<Response:string>"',
  //   execute: () => {
  //     // Gitignore the file so local boys not overwrote
  //     // write trigger as key response as value to the JSON file
  //     // echo command successfully added and repeat what was added in an embed
  //   }
  // },
  // delResp: {
  //   desc: 'Delete a trigger and response from the bot',
  //   args: '"<Trigger:string>"', // Just the trigger needed to delete from the JSON
  //   execute: () => {
  //     // Search for trigger and delete from file
  //     // respond with the trigger and response deleted so canbe readded if mistake?
  //     // allow to delete with number in list as well as trigger?
  //   }
  // },
  responses: {
    desc: 'List all the triggers and responses written to the bot',
    args: '',
    execute: (client, msg) => {
      var resps = fs.readFileSync(`${__dirname}/data/guilds/${msg.guild.id}/responses.json`, 'utf8');

      if (resps) {
        var oResps = JSON.parse(resps);

        msg.delete().then().catch(console.error);

        let embed = new Discord.RichEmbed()
          .setColor(3447003)
          .setDescription(':information_source: here are my responses')
          .setThumbnail(client.user.avatarURL) // Bot's avatar
          .addBlankField(true);

        for (var responses in oResps) {
          if (oResps) {
            embed.addField(`${responses}`, `"${oResps[responses]}"`);
          }
        }

        msg.channel.send({embed});
      }
    }
  },
  clap: {
    desc: ':clap:get:clap:your:clap:point:clap:across:clap:',
    args: '<string>(-raw)',
    execute: (client, msg, args) => {
      let clap = ':clap:';

      if (args[args.length - 1] === '-raw') {
        clap = '\\👏';
        args.splice(args.length - 1, args.length);
      }

      let str = clap; // Prepend a clap

      for (let i = 0; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + clap;
        }
      }

      msg.delete().then().catch(console.error);
      msg.channel.send(str);
    }
  },
  banner: {
    desc: 'Turn your text into 🇪 🇲 🇴 🇯 🇮',
    args: '<string> A-Z and 0-9',
    execute: (client, msg, args) => {
      let str = '';
      let i = 0;

      for (i; i < args.length; i++) {
        if (i !== 0) {
          str += args[i] + ' ';
        }
      }

      var numStr = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
      let a = str.toLowerCase()
        .replace(/([a-z])/g, ':regional_indicator_$1: ')
        .replace(/([0-9])/g, function ($1) {
          return numStr[$1];
        });

      msg.delete().catch(console.error);
      msg.channel.send(a);
    }
  },
  drake: {
    desc: 'Generate a dank memay',
    args: '"Top Text" "Bottom Text"',
    execute: (client, msg, args) => {
      // Hard code one as an example, need to think about a more dynamic approach
      // For all the legit new cool mems on the block dawg
      if (args.length < 2) {
        msg.channel.send("please give me two inputs my dude");
      } else {
        let str = '';
        let i = 0;

        for (i; i < args.length; i++) {
          if (i !== 0) str += args[i] + ' '; // Args into 1 string
        }

        memeText = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

        try {
          var text1 = memeText[0].replace(/['"]+/g, ''); // Shitty quote removal
          var text2 = memeText[1].replace(/['"]+/g, '');
        } catch (e) {
          msg.channel.send('Small **oof** my dude check your quotes');
          console.log('args error: \n' + e);
          return;
        }

        var headers = {
          'User-Agent' : 'Super Agent/0.0.1',
        }

        var options = {
          url: 'https://api.imgflip.com/caption_image',
          method: 'POST',
          headers: headers,
          form: {
            'template_id': '124276589',
            'username': `${env.IMGFLIP_USER}`,
            'password': `${env.IMGFLIP_PASS}`,
            'max_font_size': '30px',
            'boxes': [{
              "text": text1,
              "x": 190, // Hardcoded values to make drake meme work
              "y": 10,
              "width": 180,
              "height": 180,
              "color": "#ffffff",
              "outline_color": "#000000"
            },
            {
              "text": text2,
              "x": 190,
              "y": 130,
              "width": 180,
              "height": 180,
              "color": "#ffffff",
              "outline_color": "#000000"
            }]
          },
        }

        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var resp = JSON.parse(body);
            try {
              msg.channel.send('© ' + (msg.member.nickname ? msg.member.nickname : msg.author.username) + ':\n' + resp['data']['url']);
            } catch (e) {
              msg.channel.send('Big **oof** my dude check the logs');
              console.log('imgflip error: \n' + e);
            }

          }
        })

        msg.delete().catch(console.error);
      }
    }
  }
};

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
