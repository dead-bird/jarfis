require('dotenv').config({path: '.env'});

const Discord = require('discord.js');
const fs = require('fs');
const Twitter = require('twitter');

module.exports = {
  help: {
    desc: 'Lists all available commands.',
    args: '',
    execute: (client, msg, args) => {
      var embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setDescription('\:information_source\: here are my commands')
        .setThumbnail(client.user.avatarURL) // bot's avatar
        .addBlankField(true);

      for (var command in module.exports) {
        embed.addField(`!${command} ${module.exports[command].args}`, module.exports[command].desc);
      }

      msg.channel.send({embed});
    }
  },
  name: {
    desc: 'Returns the current name of the bot.',
    args: '',
    execute: (client, msg, args) => {
      var bot = (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);

      msg.channel.send(`the name's ${bot}, don't wear it out`);
    }
  },
  loc: {
    desc: 'Returns the bot\'s environment.',
    args: '',
    execute: (client, msg) => {
      msg.channel.send(`chillin' at ${process.env.ENV}`);
    }
  },
  r: {
    desc: 'Rates a meme.',
    args: '<integer between 0 and 5>',
    execute: (client, msg, args) => {
      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send(msg.member.nickname ? msg.member.nickname : msg.author.username, {
        file: `app/resources/${args[1]}.png`
      });
    }
  },
  change: {
    desc: 'Changes the name of the bot.',
    args: '<string: no spaces... for now>',
    execute: (client, msg, args) => {
      var bot;

      msg.guild.member(client.user).setNickname(args[1]).then(function () {
        bot = (msg.guild.member(client.user).nickname ? msg.guild.member(client.user).nickname : client.user.username);
        msg.channel.send(`just call me ${bot}`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`))
    }
  },
  reset: {
    desc: 'Resets the name of the bot.',
    args: '',
    execute: (client, msg) => {
      msg.guild.member(client.user).setNickname('Jarfis').then(function () {
        msg.channel.send(`reverting to Jarfis. Don't fuck me up again I'm a soft boy`);
      }).catch(error => msg.reply(`can't do that my dude: ${error}`))
    }
  },
  tweet: {
    desc: 'Pulls in a tweet.',
    args: '<string: URL of the tweet to pull in> <integer>',
    execute: (client, msg, args) => {
      var tw = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      });

      tw.get('favorites/list', function(error, tweets, response) {
        // if(error) throw error;
        console.log('wip');  // The favorites. 
        // console.log(response);  // Raw response object. 
      });

      msg.channel.send(`haha yes that was a tweet`);
    }
  },
  flip: {
    desc: 'Flip a coin.',
    args: '',
    execute: (client, msg) => { //should be more modular and less shit
      var heads = 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif',
          tails = 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif',
          res   = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails',
          embed = new Discord.RichEmbed()
          .setColor((res === 'heads' ? '3232ff' : 'FFD700'))
          .setTitle(`it's ${res} motherfucker`)
          .setThumbnail((res === 'heads' ? heads : tails))
          .addBlankField(true);

      msg.channel.send({embed});
    }
  },
  rc: {
    desc: 'Rancaps your text.',
    args: '<string>',
    execute: (client, msg, args) => {
      var str = '',
          a   = {},
          i   = 0,
          n,
          r;

      for (i; i < args.length; i++) {
        if (i !== 0) { str = str += args[i] + ' '; }
      }

      a = str.split(""),
      n = a.length;

      for (var i = n - 1; i >= 0; i--) {
        r = Math.floor(Math.random() * n) + 1;
        a[r] = (a[r] ? a[r].toUpperCase() : '');
      }

      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send(a.join(""));
    }
  },
  clear: {
    desc: 'Hide the edge.',
    args: '',
    execute: (client, msg) => {
      msg.delete()
        .then()
        .catch(console.error);

      msg.channel.send('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n+--------+\n+**CLEAR**+\n+--------+');
    }
  },
  think: {
    desc: 'Shows a random thinking emoji',
    args: '',
    execute: (client, msg) => {
      var filePath = './app/resources/thinking/'
          
      fs.readdir(filePath, (err, data)=>{

        var r = Math.floor(Math.random() * data.length),
            selection = filePath + data[r]                        
          
        msg.delete()
          .then()
          .catch(console.error);    

        msg.channel.send({
          file: selection
        });
      })
    }
  }
};
