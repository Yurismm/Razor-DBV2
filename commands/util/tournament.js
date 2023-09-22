const { model, Schema } = require("mongoose");


let tournamentSchema = new Schema({
    TournamentName: String,
    TournamentGame: String,
    TournamentParticipants: Number,
    TournamentTeamAmount: Number,
    TournamentPrizeAmount: Number,
    TournamentDate: String,
    TournamentChannel: String
})

module.exports = model("tournamentSchema", tournamentSchema);