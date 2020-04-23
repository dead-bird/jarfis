const errorHandler = require('../utils/error');
const serverModel = require('../models/servers');

module.exports = {
    desc: 'use this when you want some help my guy',
    execute: async (message, client, args) => {

        const server = await serverModel.read({ discordId: message.guild.id });

        let helpMessage = '';

        const Commands = require('./_export');
        for (let command in Commands) {
            let helpArgs = '';
            let helpFlags = '';
            if (Commands[command].args) {
                for (let [index, commandArgs] of Commands[command].args.entries()) {
                    helpArgs += (index === Commands[command].args.length - 1 ? ` '${commandArgs}'` : ` '${commandArgs}' |`)
                }
            }
            if (Commands[command].flags) {
                for (let flag of Commands[command].flags) {
                    helpFlags += ` --${flag}`
                }
            }
            helpMessage += `${server[0].settings.prefix}${command}${helpArgs}${helpFlags} :: ${Commands[command].desc}\n`
        }
        message.delete().catch(err => errorHandler.dead(message, err));
        message.author.send('```asciidoc\n' + helpMessage + '```');
        message.channel
            .send(`${message.author.username}, peep your dm's chief. I've told you how you can use me uwu 😛`)
            .then(message => {
                message.delete({ timeout: 5000 }).catch(err => errorHandler.dead(message, err));
            })
            .catch(err => errorHandler.dead(message, err));
    }
}