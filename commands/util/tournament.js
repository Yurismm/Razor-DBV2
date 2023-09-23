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
    ToggleScore: Boolean
    // Toggle Thread?
})

module.exports = model('tournamentSchema', tournamentSchema);