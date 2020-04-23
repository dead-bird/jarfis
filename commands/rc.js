const errorHandler = require('../utils/error');

module.exports = {
    desc: 'RaNdyCaP yOUr tExT',
    args: ['text'],
    execute: (message, client, args) => {
        if (args.length <= 0) return errorHandler.args(message);
        str = args.text.split('').map(c => Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()).join('');

        message.delete().catch(err => errorHandler.dead(message, err));
        message.channel.send(str).catch(err => errorHandler.dead(message, err));
    }
}