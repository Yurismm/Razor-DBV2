const { SlashCommandBuilder } = require('discord.js');
const tournamentSchema = require('./tournament')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggle-bracket')
        .setDescription('Toggle bracket system')
        .addBooleanOption(option =>
            option.setName('toggle_bracket')
            .setDescription('Toggles the bracket system?')
            .setRequired(true),
        ),
    async execute(interaction) {
        const ToggleBracket = interaction.options.getBoolean('ToggleBracket');

        tournamentSchema.findOne({ ToggleBracket: false })

        async(err, data) => {
            if (err) throw err;
            if (!data) {
                if (interaction.options.getBoolean("toggle_bracket") = true) {
                    console.log("Bracket Toggled")
                    tournamentSchema.findOneAndUpdate({
                        ToggleBracket: true
                    })
                    console.log(data)
                }
            }
        }

        const togglebracketEmbed = {
            color: 0x0099ff,
            title: "**Bracket Toggled**",
            description: "Bracket Toggled"
        }
        await interaction.reply({ embeds: [togglebracketEmbed] });
    }
}