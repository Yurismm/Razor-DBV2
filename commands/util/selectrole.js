const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
      .setName('selectrole')
      .setDescription('Select a role by clicking a button'),
    async execute(interaction) {
      const roles = {
        'Valorant': '1172297161887731792', 
        'Osu': '1172297280624283678', 
        'Minecraft': '1172297245698302132', 
        'CS': '1172297319190892696', 
        'Musedash': '1172297585407578192', 
      };

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('Osu')
            .setLabel('Osu')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('Valorant')
            .setLabel('Valorant')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('Minecraft')
            .setLabel('Minecraft')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('CS')
            .setLabel('CS')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('Musedash')
            .setLabel('Musedash')
            .setStyle(ButtonStyle.Primary),
        );

      await interaction.reply({ content: 'Choose a role:', components: [row] });
    },
  };