const errorHandler = require('../utils/error');

module.exports = (message, client, args) => {

    // if mentioned use their userdata instead
    let mention = message.mentions.users.first();
    let user = mention ? mention : message.author;

    if (user.presence.activities && user.presence.activities.length > 0) {
        let spotifyActivity = user.presence.activities.filter(activity => {
            if (activity.name === 'Spotify') {
                return activity;
            }
        });
        if (spotifyActivity[0]) {
            try {
                str = `🎵 - ${user} is now listening to ${spotifyActivity[0].details} <a:fortnite:491257645823688714>\n https://open.spotify.com/track/${spotifyActivity[0].syncID} `;
                message.delete();
                return message.channel.send(str).catch(err => console.log(err));
            } catch (err) {
                console.log(err);
                return errorHandler.dead(message, err);
            }
        }
    }

    message.delete();
    message.channel.send(`<a:fortnite:491257645823688714> ${user}, sorry bro I can't tell if you're jamming or not :(`).catch(err => console.log(err));
}