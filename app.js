const Discord = require('discord.js');
const client = new Discord.Client();
const botToken = process.env.DISCORD_BOT_TOKEN;
const pinEmoji = process.env.DISCORD_BOT_PIN_EMOJI || '📌';
const wastebasketEmoji = '🗑';

async function dmPinnedMessage (messageReaction, user) {
  if (!user.dmChannel) {
    await user.createDM();
  }
  let time = new Date(messageReaction.message.createdTimestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  let info = time + '(UTC)' + ' <@' + messageReaction.message.author.id + '> ' + 'in <#' + messageReaction.message.channel.id + '>';
  let message = '[' + info + '] ' + messageReaction.message.content;
  let attachments = [];
  for (const [key, attachment] of messageReaction.message.attachments) {
    attachments.push(attachment.url);
  }
  let messageSent = await user.dmChannel.send(message, {files: attachments});
  messageSent.react(wastebasketEmoji);
}

function deleteDM(messageReaction, user) {
  if (messageReaction.message.author === client.user && user !== client.user) {
    messageReaction.message.delete();
  }
}

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('messageReactionAdd', async (messageReaction, user) => {
  if (messageReaction.emoji.name === pinEmoji) {
    dmPinnedMessage(messageReaction, user);
} else if (messageReaction.emoji.name === wastebasketEmoji) {
    deleteDM(messageReaction, user);
  }
});

client.login(botToken);
