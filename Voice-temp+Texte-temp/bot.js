const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'create-temp-channel') {
    const channelName = interaction.options.getString('name');
    const time = interaction.options.getInteger('time');

    await interaction.deferReply();

    const category = interaction.channel.parent;
    const everyone = interaction.guild.roles.everyone;
    const member = interaction.member;

    const voiceChannel = await interaction.guild.channels.create(channelName, {
      type: 'GUILD_VOICE',
      parent: category,
      permissionOverwrites: [
        {
          id: everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: member.id,
          allow: ['VIEW_CHANNEL'],
        },
      ],
    });

    const textChannel = await interaction.guild.channels.create(`${channelName}-text`, {
      type: 'GUILD_TEXT',
      parent: category,
      permissionOverwrites: [
        {
          id: everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: member.id,
          allow: ['VIEW_CHANNEL'],
        },
      ],
    });

    const embed = new MessageEmbed()
      .setTitle('Nouveaux salons créés !')
      .setDescription(`Les salons ${voiceChannel} et ${textChannel} ont été créés pour ${time} minutes !`);

    await interaction.editReply({ embeds: [embed] });

    setTimeout(() => {
      voiceChannel.delete();
      textChannel.delete();
    }, time * 60 * 1000);
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
