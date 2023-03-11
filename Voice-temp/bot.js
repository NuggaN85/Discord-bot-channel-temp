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

    const newChannel = await interaction.guild.channels.create(channelName, {
      type: 'GUILD_VOICE',
      parent: interaction.channel.parent,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: interaction.user.id,
          allow: ['VIEW_CHANNEL'],
        },
      ],
    });

    const embed = new MessageEmbed()
      .setTitle('Nouveau salon créé !')
      .setDescription(`Le salon ${newChannel} a été créé pour ${time} minutes !`);

    await interaction.editReply({ embeds: [embed] });

    setTimeout(() => {
      newChannel.delete();
    }, time * 60 * 1000);
  }
});

client.login('YOUR_BOT_TOKEN_HERE');
