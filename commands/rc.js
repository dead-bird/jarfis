const errorHandler = require('../utils/error');

module.exports = (message, client, args) => {
    if (!args) return errorHandler.args(message);

    let str = args.join(' ');
    str = str.split('').map(c => Math.random() < 0.5 ? c.toLowerCase() : c.toUpperCase()).join('');
    
    message.delete();
    message.channel.send(str).catch(err => errorHandler.dead(message, err))
}