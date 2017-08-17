
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'MzQ3NzU5MzA1NzcwMDA4NTc2.DHdOPg.DddFsqOu9RuX5hfVxx91k5u1h0k';
const regex = /!r(.*)([0-5])/g;

client.on('ready', () => {
  console.log('ready to meme');
});

client.on('message', message => {
  var match = regex.exec(message.content);

  if (match) {
    message.channel.send('', {
        file: `resources/${match[2]}.png`
    });
  }
  if (message.content === 'bye memestar') {
    message.channel.send('see ya, wouldn\'t wanna meme ya');
  }
});

client.login(token);
