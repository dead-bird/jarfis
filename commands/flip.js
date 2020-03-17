const Discord = require('discord.js');

module.exports = (message, client, args) => {
    let flip = {
        heads: {
            imageUrl: 'https://i.gyazo.com/e380b49fc9e2b8b86571975f7df01d52.gif',
            colour: '3232ff'
        },
        tails: {
            imageUrl: 'https://i.gyazo.com/8697b5c1f85e43ec9580bc59727c5fcc.gif',
            colour: 'FFD700'
        }
    }
    let selection = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';
    let embed = new Discord.MessageEmbed().setColor(flip[selection].colour).setTitle(`it's ${selection} motherfucker`).setImage(flip[selection].imageUrl);

    message.delete().catch(err => errorHandler.dead(message, err));
    message.channel.send({ embed });
}