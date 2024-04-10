const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField,ChatInputCommandInteraction} = require('discord.js');
const ProtectionSettings = require('../../Database/models/protection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antilink') 
        .setDescription('Anti-link protection settings')
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Set the mode to enable/disable link protection')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'true' },
                    { name: 'off', value: 'false' },
                )
        )
        .addChannelOption(option => 
            option
                .setName('channel')
                .setDescription('Select the channel for link protection')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText).setRequired(true)),
 
            /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return await interaction.reply({ content: 'You do not have permissions to execute this command.' });

        const mode = interaction.options.getString('mode');
        const channel = interaction.options.getChannel('channel');

        let settings = await ProtectionSettings.findOne({ guildId: interaction.guild.id });

        if (!settings) {
            settings = new ProtectionSettings({
                guildId: interaction.guild.id,
                isCodeEnabledProtectionLink: mode === 'true' ? true : false,
                RoomLink: channel.id
            });
        } else {
            settings.isCodeEnabledProtectionLink = mode === 'true' ? true : false;
            settings.RoomLink = channel.id;
        }

        await settings.save();

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('AntiLin')
            .setDescription(`Link protection is now ${settings.isCodeEnabledProtectionLink ? 'enabled' : 'disabled'} in ${channel.name}`)
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() }); 

        interaction.channel.send({ embeds: [exampleEmbed] })
            .catch(console.error);
    }   
};
