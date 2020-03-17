const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (message, client, args) => {
    const trigger = args[0].toLowerCase();
    if (!args) {
        return errorHandler.args(message);
    } else if (!trigger || !args[1]) {
        return errorHandler.args(message, 'Small **oof** my dude check that formatting');
    }

    const selfDestruct = ((args[2] && args[2].match('true') || args[2] && args[2].match('yes')) ? true : false);
    const fullMatch = ((args[3] && args[3].match('true') || args[3] && args[3].match('yes')) ? true : false);
    const server = await serverModel.read({ discordId: message.guild.id });

    if (server[0]) {
        if (server[0].responses[trigger]) {
            return errorHandler.general(message, `be more original "${trigger}" is already a trigger`);
        }

        server[0].responses[trigger] = {
            response: args[1],
            author: message.author.id,
            destruct: selfDestruct,
            fullMatch: fullMatch
        }

        await serverModel.update({ _id: ObjectId(server[0]._id) }, server[0]);

        message.delete();
        message.channel.send(`*I'll remember that*`).then(message => {
            message.delete({ timeout: 3000 }).catch(err => errorHandler.dead(message, err));
        })
    } else {
        return errorHandler.general(message, 'Small **oof** my dude im not set up properly in this server');
    }

}