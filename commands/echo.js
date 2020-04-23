const errorHandler = require('../utils/error');

module.exports = {
    desc: `Speak on Jarfis' behalf.`,
    args: ['text'],
    execute: (message, client, args) => {
        if (!args || args && !args.text) {
            return errorHandler.args(message);
        }
        message.delete().catch(err => errorHandler.dead(message, err));
        message.channel.send(args.text).catch(err => errorHandler.dead(message, err));
    }
}