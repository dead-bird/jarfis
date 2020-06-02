const errorHandler = require('../utils/error');
const serverUtil = require('../utils/server');

module.exports = {
    desc: `Check that dyl isn't making Jarfis lie again`,
    execute: (message, client, args, flags) => {
        console.log(message.channel);
        
        serverUtil.announcePins(message.channel);
    }
}