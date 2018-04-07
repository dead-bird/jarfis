const core = require('../core.js');
const request  = require('request');

let self = module.exports = {
  alias: ['drake'],
  
  desc: 'Generate a dank memay',

  args: '"Top Text" "Bottom Text"',
  
  execute: (client, msg, args) => {
    // Hard code one as an example, need to think about a more dynamic approach
    // For all the legit new cool mems on the block dawg
    if (args.length < 2) return core.err.args(msg);
    
    let str = '';

    args.forEach(arg => { str += arg + ' ' });

    memeText = str.match(/"([^"]|"")*"/g); // Array of all matches (text in "")

    try {
      var text1 = memeText[0].replace(/['"]+/g, '').toUpperCase(); // Shitty quote removal
      var text2 = memeText[1].replace(/['"]+/g, '').toUpperCase();
    } catch (e) {
      console.log('args error: \n' + e);
      return msg.channel.send('Small **oof** my dude check your quotes');
    }

    let headers = {
      'User-Agent' : 'Super Agent/0.0.1',
    }

    let options = {
      url: 'https://api.imgflip.com/caption_image',
      method: 'POST',
      headers: headers,
      form: {
        template_id: 124276589,
        username: env.IMGFLIP_USER,
        password: env.IMGFLIP_PASS,
        max_font_size: '30px',
        boxes: [
          {
            text: text1,
            x: 190, // Hardcoded values to make drake meme work
            y: 10,
            width: 180,
            height: 180,
            color: '#ffffff',
            outline_color: '#000000'
          },
          {
            text: text2,
            x: 190,
            y: 130,
            width: 180,
            height: 180,
            color: '#ffffff',
            outline_color: '#000000'
          }
        ]
      },
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let resp = JSON.parse(body);

        try {
          msg.channel.send('© ' + (msg.member.nickname || msg.author.username) + ':\n' + resp['data']['url']);
        } catch (e) {
          msg.channel.send('Big **oof** my dude check the logs').catch(err => core.err.dead(msg, err));
          console.log('imgflip error: \n' + e);
        }
      }
    });

    msg.delete().catch(console.error);
  }
}
