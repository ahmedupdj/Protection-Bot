const { Events } = require('discord.js');
const Protection = require('../../Database/models/protection');
let banActivityCache = [];
const Discord = require('discord.js')
module.exports = {
    name: Events.ChannelDelete,
    async execute(member, client) {
        const guild = member.guild;
        const protectionData = await Protection.findOne({ guildId: guild.id });

        if (!protectionData) {
            return;
        }
        
        const config = {
            banMonitoring: {
                active: protectionData.isCodeEnabledAntiChannelDelete,                
                maxBans: protectionData.LimitChannelDelete,
                action: protectionData.PunishmentChannelDelete,
                allowedGuildId: protectionData.guildId
            },
        };
        
        if (!config.banMonitoring.active || guild.id !== config.banMonitoring.allowedGuildId) {
            return;
        }
        

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: Discord.AuditLogEvent.ChannelDelete,
        });

        if (!fetchedLogs) {
            return;
        }

        const recentBanEntry = fetchedLogs.entries.first();
        if (!recentBanEntry) {
            return;
        }

        const executor = recentBanEntry.executor;

        const executorMember = await guild.members.fetch(executor.id).catch(() => {
            return null;
        });
        if (!executorMember) return;


        banActivityCache.push({ executorId: executor.id });
    

        const recentBans = banActivityCache.filter(record => record.executorId === executor.id).length;

        if (recentBans > config.banMonitoring.maxBans) {
            switch (config.banMonitoring.action) {
                case 1:
                    if (executorMember.roles) {
                        const executorRoles = Array.from(executorMember.roles.cache.keys());
                        for (const roleId of executorRoles) {
                            const role = guild.roles.cache.get(roleId);
                            if (role) {
                                await executorMember.roles.remove(roleId).catch((error) => {
                                    console.log(error);
                                });
                            } else {
                                console.log(`Role with ID ${roleId} not found.`);
                            }
                        }
                    }
                break;
                case 2:
                    if (executorMember.kickable) await executorMember.kick('Excessive banning detected.');
                    break;
                case 3:
                    if (executorMember.bannable) await executorMember.ban({ reason: 'Excessive banning detected.' });
                    break;
            }

            

            banActivityCache = banActivityCache.filter(record => record.executorId !== executor.id);
        }

    }
};
