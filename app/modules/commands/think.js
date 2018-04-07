const core = require('../core.js');

let self = module.exports = {
  alias: ['think'],
  
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

        msg.channel.send({ file: selection }).catch(err => core.err.dead(msg, err));
      }
    });
  }
}
