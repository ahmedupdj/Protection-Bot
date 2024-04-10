const { Events } = require('discord.js');
const Protection = require('../../Database/models/protection');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (!message.guild || message.author.bot) return;

        const protectionSettings = await Protection.findOne({ guildId: message.guild.id });

        if (protectionSettings && protectionSettings.isCodeEnabledProtectionLink && containsLink(message.content)) {
            if (message.channel.id !== protectionSettings.RoomLink) {
                await message.delete();
                await message.author.send('Please send links only in the designated channel.');
            }
        }
    }
}

function containsLink(text) {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;
    return linkRegex.test(text);
}
