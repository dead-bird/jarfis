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
    }
}