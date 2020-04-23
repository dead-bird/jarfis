const errorHandler = require('../utils/error');
const space = require('../resources/space');

module.exports = {
    desc: 'Put some space between you and the edge.',
    execute: (message, client, args) => {
        message.delete().catch(err => errorHandler.dead(message, err));
        message.channel.send(space).catch(err => errorHandler.dead(message, err));
    }
}