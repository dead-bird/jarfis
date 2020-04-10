const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');

module.exports = {
    desc: 'add a response',
    args: ['trigger', 'response', 'selfDestruct', 'fullMatch'],
    execute: async (message, client, args) => {
        if (!args) {
            return errorHandler.args(message);
        } else if (!args.trigger || !args.response) {
            return errorHandler.args(message, 'Small **oof** my dude check that formatting');
        }

        const selfDestruct = ((args.selfDestruct && args.selfDestruct.match('true') || args.selfDestruct && args.selfDestruct.match('yes')) ? true : false);
        const fullMatch = ((args.fullMatch && args.fullMatch.match('true') || args.fullMatch && args.fullMatch.match('yes')) ? true : false);
        const server = await serverModel.read({ discordId: message.guild.id });

        if (server[0]) {
            if (server[0].responses[args.trigger]) {
                return errorHandler.general(message, `be more original \`${args.trigger}\` is already a trigger`);
            }

            server[0].responses[args.trigger] = {
                response: args.response,
                author: message.author.id,
                destruct: selfDestruct,
                fullMatch: fullMatch
            }
            server[0].updatedAt = new Date();

            await serverModel.update({ discordId: message.guild.id }, server[0]);

            message.delete().catch(err => errorHandler.dead(message, err));
            message.channel.send(`*I'll remember that*`).then(message => {
                message.delete({ timeout: 3000 }).catch(err => errorHandler.dead(message, err));
            })
        } else {
            return errorHandler.general(message, 'Small **oof** my dude im not set up properly in this server');
        }
    }
}