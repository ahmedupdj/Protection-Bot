const { Client, Collection, GatewayIntentBits } = require("discord.js");
const Discord = require("discord.js");
const client = (global.Client = new Discord.Client({ intents: Object.keys(GatewayIntentBits) }));
const config = require("./config.js");
global.config = config;
const fs = require("fs");
client.htmll = require('cheerio');
/*=======================================================================================*/

client.SlashCommands = new Discord.Collection(); 
fs.readdirSync("./handlers").forEach(handler => {
    require(`./handlers/${handler}`)(client);
});





//Eroros
process.on('unhandledRejection', (reason, p) => {
    console.log(reason)
const webhook = new Discord.WebhookClient({ url: `${config.bot.WebhookClient}` });
  webhook.send({ content: ':rotating_light: **ERROR**\n\n' + reason });
    });
  process.on('uncaughtException', (err, origin) => {
        console.log(err)
        const webhook = new Discord.WebhookClient({ url: `${config.bot.WebhookClient}` });

  webhook.send({ content: ':rotating_light: **ERROR**\n\n' + err  });
    });
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err)
    const webhook = new Discord.WebhookClient({ url: `${config.bot.WebhookClient}` });
    webhook.send({ content: ':rotating_light: **ERROR**\n\n' + err });
  });



module.exports.Client = client;
/*=======================================================================================*/

require("./Database/Connection.js")(client);

client.login(config.bot.token);
/*=======================================================================================*/
