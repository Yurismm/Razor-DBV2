const { SlashCommandBuilder } = require('discord.js');
const tournamentSchema = require('./tournament')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-bracket')
        .setDescription('Toggle bracket system')
        .addBooleanOption(option =>
            option.setName('ToggleBracket')
            .setDescription('Toggles the bracket system?')
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('Bracket_Send_Channel')
            .setDescription('channel at which it is sent?')
            .setRequired(true)
        ),
    
    async execute(interaction){
        const ToggleBracket = interaction.options.getBoolean('ToggleBracket');
        const BracketSendChannel = interation.options.getChannel('Bracket_Send_Channel');

        tournamentSchema.findOne({ToggleBracket:ToggleBracket})
        
    }



}