const mongo = require(`../mongo`);
const suggestionSchema = require(`../Schemas/suggestion-schema`);

module.exports = {
    name: 'suggest',
    description: 'send suggestions in the suggestion channel.',
    usage: '%suggest <suggestion>',
    async execute(message, args, bot, Discord, prefix) {
        if (args<1) return message.channel.send(`Please type the suggestion also.`)
        let mes = await message.channel.send("Searching for the Suggestion Channel.");
        let suggestionchannel = bot.suggestionChannel.get(message.guild.id);
        if (!suggestionchannel) {
          await mongo().then(async (mongoose)=>{
            try {
              const result = await suggestionSchema.findOne({
                _id: message.guild.id
              })
              suggestionchannel = result!=null?result.channel_Id:null;
            }
            finally {
              mongoose.connection.close()
            }
          })
        }
        if (suggestionchannel){
          bot.suggestionChannel.set(message.guild.id, suggestionchannel);
        }
        else {
          return mes.edit(`No suggestion channel set. If you are an administrator, please do \`${prefix}help setsuggestion\` to know how to set a suggestion channel.`)
        }
        let channel = message.guild.channels.cache.get(suggestionchannel);
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Suggestion")
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(args.join(" "))
        .setFooter("Suggested at")
        .setTimestamp();
        channel.send(embed).then((msg)=>{
          msg.react("👍").then(()=>{
            msg.react("👎");
          })
        })
        mes.edit(`Suggestion posted in <#${suggestionchannel}>`).then((msg)=>{
          setTimeout(()=>{
            msg.delete()
            message.delete()
          },3000)
        })
    }
}