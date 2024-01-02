const { SlashCommandBuilder } = require('discord.js');
const tournamentSchema = require('./tournament.js');
const { data } = require('./ping');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('coutdata')
        .setDescription('personal command for debugging'),

    async execute(interaction) {
        const coutdataembed = {
            color: 0x0099ff,
            title: '**Check command line (:**',
            description: 'Check command line (:'
        }

        await interaction.reply({ embed: [coutdataembed] })

        tournamentSchema.findOne({
                TournamentName,
                TournamentGame,
                TournamentParticipants,
                TournamentTeamAmount,
                TournamentPrizeAmount,
                TournamentDate,
                TournamentTime,
                TournamentChannel,
                ToggleBracket,
                ToggleScore,
            },

            async(err, data => {
                    if (err) throw err;

                    if (data) {
                        console.log(data);
                    }

                }


            )

        )
    }

}