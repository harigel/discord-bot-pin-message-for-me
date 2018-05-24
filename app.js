const Discord = require('discord.js');
const client = new Discord.Client();
const botToken = process.env.DISCORD_BOT_TOKEN;
const pinEmoji = process.env.DISCORD_BOT_PIN_EMOJI || '📌';
const wastebasketEmoji = '🗑';

async function dmPinnedMessage (messageReaction, user) {
  if (!user.dmChannel) {
    await user.createDM();
  }
  let text = `${pinEmoji} message by <@${messageReaction.message.author.id}> in <#${messageReaction.message.channel.id}>/${messageReaction.message.guild.name} ${pinEmoji}\n${messageReaction.message.content}`;
  let messageOptions = {};
  messageOptions.embed = {
    author: {
      name: messageReaction.message.author.username,
      icon_url: messageReaction.message.author.avatarURL,
    },
    timestamp: new Date(messageReaction.message.createdTimestamp).toISOString(),
  };
  if (messageReaction.message.attachments.size > 0) {
    messageOptions.files = messageReaction.message.attachments.map(attachment => attachment.url);
  }
  let dmMessage = await user.dmChannel.send(text, messageOptions);
  dmMessage.react(wastebasketEmoji);
}

function deleteDM(messageReaction, user) {
  messageReaction.message.delete();
}

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('messageReactionAdd', async (messageReaction, user) => {
  if (user.bot) {
    return;
  }
  if (messageReaction.emoji.name === pinEmoji) {
    dmPinnedMessage(messageReaction, user);
  } else if (messageReaction.emoji.name === wastebasketEmoji) {
    deleteDM(messageReaction, user);
  }
});

client.login(botToken);
