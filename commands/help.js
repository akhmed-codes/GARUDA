
module.exports = {
    name: 'help',
    description: 'shows the help menu',
    execute(message, args, bot, Discord) {
        const fs = require('fs');
        const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
        const helpembed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle('Help Menu')
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp();
        if (commandFiles.includes(args[0]+".js")) {
           const command = require(`${__dirname}/${args[0]}.js`).description; 
           helpembed.addFields({name:`${args[0]}`, value: `${command}`});
        }
        else {
            let categories = ["moderation","fun","info", "utility"]
            let totalFiles = commandFiles.length;
            let notype = "";
            for (let cat in categories) {
                let str = "";
                for (const file of commandFiles) {
                    const command = require(`${__dirname}/${file}`);
                    if (command.type == categories[cat]) {
                        if (str == "")
                            str += `\`${command.name}\``;
                        else
                            str += `, \`${command.name}\``;
                    }
                    if (command.type == undefined) {
                        if (notype == "")
                            notype += `\`${command.name}\``;

                        else
                            notype += `, \`${command.name}\``;
                    }
                }
                helpembed.addFields({name:`${categories[cat]}`, value: str?str:"No command"});
            }
            helpembed.addFields({name:`No category`, value: notype?notype:"No command"});
        }
        message.channel.send(helpembed);
    }
}
 
