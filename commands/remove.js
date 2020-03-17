const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');

module.exports = async (message, client, args) => {
    const trigger = args[0];
    if (!args) {
        return errorHandler.args(message);
    } else if (!trigger) {
        return errorHandler.args(message, 'Small **oof** my dude check that formatting');
    }

    const server = await serverModel.read({ discordId: message.guild.id });
    if (server[0]) {
        if (server[0].responses[trigger]) {
            delete server[0].responses[trigger];
            await serverModel.update({ discordId: message.guild.id }, server[0]);
            
            message.delete().catch(err => errorHandler.dead(message, err));
            message.channel.send(`I've removed \`${trigger}\` from your responses`).catch(err => errorHandler.dead(message, err));
        } else {
            errorHandler.general(message, `couldn't find that trigger, maybe learn to spell?`);
        }
    } else {
        return errorHandler.general(message, 'Small **oof** my dude im not set up properly in this server');
    }
}