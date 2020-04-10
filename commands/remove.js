const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');

module.exports = {
    desc: 'You added that response, guessing you dont want it anymore',
    args: ['trigger'],
    execute: async (message, client, args) => {
        if (!args) {
            return errorHandler.args(message);
        } else if (!args.trigger) {
            return errorHandler.args(message, 'Small **oof** my dude check that formatting');
        }

        const server = await serverModel.read({ discordId: message.guild.id });
        if (server[0]) {
            if (server[0].responses[args.trigger]) {
                delete server[0].responses[args.trigger];
                server[0].updatedAt = new Date();
                await serverModel.update({ discordId: message.guild.id }, server[0]);

                message.delete().catch(err => errorHandler.dead(message, err));
                message.channel.send(`I've removed \`${args.trigger}\` from your responses`).catch(err => errorHandler.dead(message, err));
            } else {
                errorHandler.general(message, `couldn't find that trigger, maybe learn to spell?`);
            }
        } else {
            return errorHandler.general(message, 'Small **oof** my dude im not set up properly in this server');
        }
    }
}