const errorHandler = require('../utils/error');

module.exports = {
    desc: '👏get👏your👏point👏across👏',
    args: ['text'],
    flags: ['raw'],
    execute: (message, client, args, flags) => {
        let spacer = '👏';
        if (flags.raw) {
            spacer = '\\' + spacer;
        }
        let str = spacer;
        let messageTest = args.text.split(/ /g);
        for (let message of messageTest) {
            str += message + spacer;
        }
        message.delete().catch(err => errorHandler.dead(message, err));
        message.channel.send(str).catch(err => errorHandler.dead(message, err));
    }
}