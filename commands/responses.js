const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');

module.exports = {
    desc: 'List all the triggers and responses written to the bot.',
    execute: async (message, client, args) => {
        
        const server = await serverModel.read({ discordId: message.guild.id });
        
        let responseMessage = '';

        
        for (let trigger in server[0].responses) {
            responseMessage += `${(server[0].responses[trigger].destruct === true ? '-' : '+')} ${trigger} - ${server[0].responses[trigger].response} - ${client.users.cache.get(server[0].responses[trigger].author).username}\n`;
        }

        message.delete().catch(err => errorHandler.dead(message, err));
        message.author.send('```diff\n' + responseMessage + '```').catch(err => errorHandler.dead(message, err));
        message.author.send(`\`Above are all of the responses I have for ${message.guild.name} :) red ones delete the trigger when invoked whilst green ones persist. \``);
        message.channel.send(`${message.author.username}, I've slid in your dms with my responses 😛`).then(message => message.delete({ timeout: 5000 }).catch(err => errorHandler.dead(message, err))).catch(err => errorHandler.dead(message, err));
    }
}