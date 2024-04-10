const { Events } = require('discord.js');
const Protection = require('../../Database/models/protection');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member, client) {
        const guild = member.guild;
        const protectionSettings = await Protection.findOne({ guildId: guild.id });

        if (protectionSettings && protectionSettings.isCodeEnabledAntiBot) {
            if (member.user.bot) {
                if (protectionSettings.isCodeEnabledAntiBotTrusted) {
                    if (member.user.flags && member.user.flags.has('VerifiedBot')) {
                        return; 
                    } else {
                        await member.kick('Unauthorized bot entry.'); 
                    }
                } else {
                    await member.kick('Unauthorized bot entry.');
                }
            }
        }
    }
};
