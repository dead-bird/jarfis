const Commands = require('../commands/_export');

module.exports = (message, client, prefix) => {
    const messageBreakdown = message.content.split(new RegExp(`^(?:${prefix}(\\S+))`));
    messageBreakdown.shift();
    const cmd = messageBreakdown[0];
    if (messageBreakdown[1]) {
        var args = messageBreakdown[1].split(/ \| /);
        args = args.map(str => (str = str.trim()));
    }
    if (cmd in Commands && typeof Commands[cmd] === 'function') {
        Commands[cmd](message, client, args);
    }
}