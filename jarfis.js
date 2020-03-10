
require('dotenv').config({ path: '.env' });

const Discord = require('discord.js');
const client = new Discord.Client({ forceFetchUsers: true });

client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);