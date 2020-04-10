const Commands = require('../commands/_export');

module.exports = (message, client, prefix) => {
    const messageBreakdown = message.content.split(new RegExp(`^(?:\\${prefix}(\\S+))`));
    messageBreakdown.shift();
    const cmd = messageBreakdown[0];

    if (cmd in Commands && typeof Commands[cmd].execute === 'function') {
        if (messageBreakdown[1]) {
            var args = messageBreakdown[1].split(/ \| /);
            args = args.map(str => (str = str.trim()));
            var flags = [];
            for (let [argIndex, arg] of args.entries()) {
                let matches = arg.match(/--(\w+)/g);
                if (matches) {
                    for (let [index, match] of matches.entries()) {
                        args[argIndex] = args[argIndex].replace(match, '');
                        args[argIndex] = args[argIndex].trim();
                        matches[index] = match.replace('--', '');
                    }
                    flags = flags.concat(matches);
                }
            }
        }

        let readableArgs = {};
        let readableFlags = {};
        if (Commands[cmd].args) {
            for (let [index, arg] of Commands[cmd].args.entries()) {
                readableArgs[arg] = args[index];
            }
        }

        if (Commands[cmd].flags) {
            for (let commandFlag of Commands[cmd].flags) {
                if (flags.length > 0) {
                    for (let messageFlag of flags) {
                        if (!readableFlags[commandFlag]) {
                            if (commandFlag === messageFlag) {
                                readableFlags[commandFlag] = true;
                            } else {
                                readableFlags[commandFlag] = false;
                            }
                        }
                    }
                } else {
                    readableFlags[commandFlag] = false;
                }
            }
        }
        Commands[cmd].execute(message, client, readableArgs, readableFlags);
    }
}