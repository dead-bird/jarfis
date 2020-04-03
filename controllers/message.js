const Commands = require('../commands/_export');

module.exports = (message, client, prefix) => {
    const messageBreakdown = message.content.split(new RegExp(`^(?:\\${prefix}(\\S+))`));
    messageBreakdown.shift();
    const cmd = messageBreakdown[0];
    if (cmd in Commands && typeof Commands[cmd].execute === 'function') {
        if (messageBreakdown[1]) {
            var args = messageBreakdown[1].split(/ \| /);
            args = args.map(str => (str = str.trim()));
        }
        let readableArgs = {};
        if (Commands[cmd].args) {
            for (let [index, arg] of Commands[cmd].args.entries()) {
                readableArgs[arg] = args[index];
            }
        }
        Commands[cmd].execute(message, client, readableArgs);
    }
}