const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osu')
        .setDescription('Provides osu infomation.')
        .addStringOption(option =>
            option.setName('username')
            .setDescription('Input your osu username')
            .setRequired(true)
            ),
    async execute(interaction){
        const osuname = interaction.options.getString("username");
        const osuembed = {
            color:0xA020F0,
            title:'osu! Profile',
            image:{
                url:'https://lemmmy.pw/osusig/sig.php?colour=pink&uname='+ osuname +'&pp=1&onlineindicator=undefined',
            }
        }
        await interaction.reply({ embeds: [osuembed] });
    }
}