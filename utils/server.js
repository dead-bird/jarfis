const pins = require('../resources/pins');

module.exports = {
    default(client, guild) {
        return {
            discordId: guild.id,
            name: guild.name,
            settings: {
                prefix: '!',
                insults: false,
                default: guild.channels.cache.first().id,
                announcements: true,
                restart: false,
                pins: 2,
                twitter: false,
            },
            responses: {
                lenny: {
                    response: '( ͡° ͜ʖ ͡°)',
                    author: client.user.id,
                    destruct: false,
                    fullMatch: false
                },
            },
            createdAt: new Date()
        }
    },
    announcePins(channel) {
        channel.startTyping();
        channel.messages.fetchPinned()        
        .then(messages => {
          const i = messages.array().length;
  
          channel.send(i + `/50 pins ${pins[i - 1]}`).catch(console.error);
          channel.stopTyping();
        })
        .catch(err => {
          console.error(err);
          channel.stopTyping();
        });
    }
}