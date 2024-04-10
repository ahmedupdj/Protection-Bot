const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChatInputCommandInteraction } = require('discord.js');
const ProtectionSettings = require('../../Database/models/protection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antirolecreate') 
        .setDescription('Anti-roleCreate protection settings')
        .addStringOption(option =>
            option
                .setName('mode')
                .setDescription('Set the mode to enable/disable roleCreate protection')
                .setRequired(true)
                .addChoices(
                    { name: 'on', value: 'true' },
                    { name: 'off', value: 'false' },
                )
        )
        .addIntegerOption(option =>
            option
                .setName('limit')
                .setDescription('Set the limit for roleCreate')

                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('punishment')
                .setDescription('Set the punishment for violating the roleCreate limit')
                .setRequired(true)
                .addChoices(
                    { name: 'Clear role', value: 1 },
                    { name: 'Kick', value: 2 },
                    { name: 'Ban', value: 3 },
                )
        ),
 
    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
            return await interaction.reply({ content: 'You do not have permissions to execute this command.' });

        const mode = interaction.options.getString('mode');
        const limit = interaction.options.getInteger('limit');
        const punishment = interaction.options.getInteger('punishment');

        let settings = await ProtectionSettings.findOne({ guildId: interaction.guild.id });

        if (!settings) {
            settings = new ProtectionSettings({
                guildId: interaction.guild.id,
                isCodeEnabledAntiRoleCreate: mode === 'true' ? true : false,
                LimitRoleCreate: limit || 3, 
                PunishmentRoleCreate: punishment || 1
            });
        } else {
            settings.isCodeEnabledAntiRoleCreate = mode === 'true' ? true : false;
            settings.LimitRoleCreate = limit || 3; 
            settings.PunishmentRoleCreate = punishment || 1; 
        }

        await settings.save();

        const punishmentText = punishment === 1 ? 'Clear role' : (punishment === 2 ? 'Kick' : 'Ban');
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Anti roleCreate Settings')
            .setDescription(`Anti roleCreate settings updated successfully`)
            .addFields({name:'roleCreate Limit', value: `${settings.LimitRoleCreate}`})
            .addFields({name:'Punishment', value: `${punishmentText}`})
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() }); 

        interaction.channel.send({ embeds: [exampleEmbed] })
            .catch(console.error);
    }   
};
