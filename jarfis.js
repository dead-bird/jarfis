require('dotenv').config({ path: '.env' });

const Discord = require('discord.js');
const ObjectId = require('mongodb').ObjectID;
const client = new Discord.Client({ forceFetchUsers: true });
const message = require('./controllers/message');
const db = require('./controllers/db');
const serverUtil = require('./utils/server');
const pkg = require('./package.json');
const jarfisModel = require('./models/jarfis');
const serverModel = require('./models/servers');
const errorHandler = require('./utils/error');

client.login(process.env.TOKEN);
client.on('error', err => console.error(err));
client.on('warn', err => console.warn(err));
client.on('ready', async () => {
    console.log(`${client.user.tag} is online @ version ${pkg.version}`);
    client.user.setPresence({ activity: { name: `in ${process.env.LOC} @ ${pkg.version}` } });

    //Load database connection
    await db();

    //Check Jarfis version and update if the package version is different to the database
    const jarfis = await jarfisModel.read({ _id: ObjectId('5e6f73031c9d440000296dff') });
    if (jarfis[0] && jarfis[0].version && jarfis[0].version !== pkg.version && jarfis[0].version < pkg.version) {
        jarfis[0].version = pkg.version;
        jarfis[0].updatedAt = new Date();
        jarfisModel.update({ _id: ObjectId('5e6f73031c9d440000296dff') }, jarfis[0]);
    }

    //Check all current servers are in the db if not create one
    client.guilds.cache.map(async guild => {
        let servers = await serverModel.read({ discordId: guild.id });
        let id = guild.channels.cache.first().id;

        if (servers.length === 0) {
            await serverModel.insert(serverUtil.default(client, guild));
            guild.channels.cache.first().send(`What up pimps! My default prefix is ! and your default channel is <#${id}>. Hit dat fatty !help to change shit`);
        }
    });
});
client.on('message', async msg => {
    if (!msg.author.bot && msg.guild) {
        const server = await serverModel.read({ discordId: msg.guild.id });
        if (server[0] && msg.content.startsWith(server[0].settings.prefix)) {
            return message(msg, client, server[0].settings.prefix)
        }

        // trigger logic, to be moved to util maybe
        for (let trigger of Object.keys(server[0].responses)) {
            if (server[0].responses[trigger].fullMatch === false && msg.content.match(new RegExp(`(?:^|\\W)${trigger}(?:$|\\W)`))) {
                msg.channel.send(server[0].responses[trigger].response).catch(err => errorHandler.dead(msg, err));
                if (server[0].responses[trigger].destruct === true) {
                    msg.delete().catch(err => errorHandler.dead(msg, err));
                }
            } else if (msg.content === trigger && server[0].responses[trigger].fullMatch === true) {
                msg.channel.send(server[0].responses[trigger].response).catch(err => errorHandler.dead(msg, err));
                if (server[0].responses[trigger].destruct === true) {
                    msg.delete().catch(err => errorHandler.dead(msg, err));
                }
            }
        }
    }
});