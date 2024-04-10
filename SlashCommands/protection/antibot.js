const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChatInputCommandInteraction } = require('discord.js');
const ProtectionSettings = require('../../Database/models/protection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antibots') 
        .setDescription('Anti-link protection settings')
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Set the mode to enable/disable bots protection')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'true' },
                    { name: 'off', value: 'false' },
                )
        )
        .addStringOption(option =>
            option
                .setName('trusted')
                .setDescription('Allowing authenticated bots to enter')
                .setRequired(false)
                .addChoices(
                    { name: 'on', value: 'true' },
                    { name: 'off', value: 'false' },
                )
        ),
 
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return await interaction.reply({ content: 'You do not have permissions to execute this command.' });

        const mode = interaction.options.getString('mode');

        const trusted = interaction.options.getString('trusted');

        let settings = await ProtectionSettings.findOne({ guildId: interaction.guild.id });

        if (!settings) {
            settings = new ProtectionSettings({
                guildId: interaction.guild.id,
                isCodeEnabledAntiBot: mode === 'true' ? true : false,
                isCodeEnabledAntiBotTrusted: trusted === 'true' ? true : false
            });
        } else {
            settings.isCodeEnabledAntiBot = mode === 'true' ? true : false;
            settings.isCodeEnabledAntiBotTrusted = trusted === 'true' ? true : false;
        }

        await settings.save();

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('AntiBot')
            .setDescription(`Bots protection is now ${settings.isCodeEnabledAntiBot ? 'enabled' : 'disabled'}`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp();

        interaction.channel.send({ embeds: [exampleEmbed] })
            .catch(console.error);
    }   
};
