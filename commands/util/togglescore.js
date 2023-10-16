const { SlashCommandBuilder } = require('discord.js');
const tournamentSchema = require('./tournament')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-score')
        .setDescription('Toggle score')
        .addBooleanOption(option =>
            option.setName('toggle_score')
            .setDescription('Toggles Score?')
            .setRequired(true),
        ),
    async execute(interaction) {
        const ToggleScore = interaction.options.getBoolean('ToggleScore');

        tournamentSchema.findOne({ ToggleBracket: false })

        async(err, data) => {
            if (err) throw err;
            if (!data) {

                if (interaction.options.getBoolean("toggle_score") = true) {
                    console.log("Bracket Toggled")
                    tournamentSchema.findOneAndUpdate({
                        ToggleScore: true
                    })
                    console.log(data)
                
                }
            }
        }

        const togglebracketEmbed = {
            color: 0x0099ff,
            title: "**Score Toggled**",
            description: "Score Toggled"
        }
        await interaction.reply({ embeds: [togglebracketEmbed] });
    }
}