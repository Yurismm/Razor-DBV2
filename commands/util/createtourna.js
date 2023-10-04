const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const tournamentSchema = require('./tournament.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('createtourna')
        .setDescription('Create a tournament')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Name of the the tournament')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('game')
            .setDescription('Name of the game for the tournament')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('participants')
            .setDescription('Number of participants in the tournament')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('team_amount')
            .setDescription('Number of teams in this tournament')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('prize_amount')
            .setDescription('The prize in (localized currency)')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('date')
            .setDescription('Start Date of the tournament (e.g., "2023-09-15")')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('time')
            .setDescription('Time of the tournament (e.g., "15:30 UTC")')
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Set the channel for the notification to be sent in')
        ),

    async execute(interaction) {

        // this is very inefficent?
        const name = interaction.options.getString('name');
        const game = interaction.options.getString('game');
        const participants = interaction.options.getInteger('participants');
        const teamamount = interaction.options.getInteger("team_amount");
        const prize_amount = interaction.options.getInteger("prize_amount");
        const dateStr = interaction.options.getString('date');
        const timeStr = interaction.options.getString('time');
        const sendchannel = interaction.options.getChannel('channel');

        tournamentSchema.findOne({
                TournamentName: name,
                TournamentGame: game,
                TournamentParticipants: participants,
                TournamentTeamAmount: teamamount,
                TournamentPrizeAmount: prize_amount,
                TournamentDate: dateStr,
                TournamentTime: timeStr,
                TournamentChannel: sendchannel,
                ToggleBracket: false,
                ToggleScore: false
            },
            async(err, data) => {
                if (err) throw err;
                if (!data) {
                    tournamentSchema.create({
                        TournamentName: interaction.options.getString('name'),
                        TournamentGame: interaction.options.getString('game'),
                        TournamentParticipants: interaction.options.getInteger('participants'),
                        TournamentTeamAmount: interaction.options.getInteger('team_amount'),
                        TournamentPrizeAmount: interaction.options.getInteger('prize_amount'),
                        TournamentDate: interaction.options.getString('date'),
                        TournamentTime: interaction.options.getString('time'),
                        TournamentChannel: interaction.options.getChannel('channel'),
                        ToggleBracket: false,
                        ToggleScore: false
                    })
                }
                if (data) {
                    console.log(data)
                }
            })

        const dateTimeStr = `${dateStr} ${timeStr}`;
        const dateTime = new Date(dateTimeStr);

        if (isNaN(dateTime.getTime())) {
            await interaction.reply('Invalid date or time format. Please use the format "YYYY-MM-DD" for date and "HH:mm UTC" for time.');
            return;
        }
        
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Tournament')
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel Tournament')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const tournamentEmbed = {
            color: 0x0099ff,
            title: '**Do you wish to publish this tournament?**',
            fields: [{
                    name: 'Game',
                    value: game,
                },
                {
                    // make this max participants so that we can see a
                    // percentage sort of in both
                    name: 'Participants',
                    value: participants.toString(),
                },
                {
                    name: "Prize Money Amount",
                    value: prize_amount.toString(),
                },
                {
                    name: 'Amount of teams',
                    value: teamamount,
                },
                {
                    name: 'Date and Time',
                    value: dateTime.toLocaleString(),
                },
                {
                    name: "Sent-Channel",
                    value: sendchannel.toString(),
                },
            ],
            image: { url: 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRM0OQsITDDUQ-PCjobiXAyUfEQn1sOAkjorPKB2miR-sYx_aCjqMSevH2Y4WjIvPoA' },
            timestamp: new Date(),
        };

        // just temp delete so we can keep previewing, i will get rid of it later
        tournamentSchema.deleteMany({
            TournamentName: name,
            TournamentGame: game,
            TournamentParticipants: participants,
            TournamentTeamAmount: teamamount,
            TournamentPrizeAmount: prize_amount,
            TournamentDate: dateStr,
            TournamentTime: timeStr,
            TournamentChannel: sendchannel,
            ToggleBracket: false,
            ToggleScore: false
        })

        await interaction.reply({ embeds: [tournamentEmbed], components: [row] });
    },
};