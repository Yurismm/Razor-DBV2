const { model, Schema } = require('mongoose');

let tournamentSchema = new Schema({
    TournamentName: String,
    TournamentGame: String,
    TournamentParticipants: Number,
    TournamentTeamAmount: Number,
    TournamentPrizeAmount: Number,
    TournamentDate: String,
    TournamentTime: String,
    TournamentChannel: String,
    ToggleBracket: Boolean,
    ToggleScore: Boolean,
    Players: [Schema.Types.Mixed],
    TournamentCreated: { type: Date, default: Date.now },
    // Toggle Thread?
})

module.exports = model('tournamentSchema', tournamentSchema);