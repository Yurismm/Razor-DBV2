require('dotenv').config();
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, InteractionType, ButtonBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

const { connect } = require('mongoose');
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const roleButtonMapping = {
    'Valorant': '1172297161887731792',
    'Osu': '1172297280624283678',
    'Minecraft': '1172297245698302132',
    'CS': '1172297319190892696',
    'Musedash': '1172297585407578192',
};

const introductoryRoleID = "1172300265416835182"

client.on("guildMemberAdd", member => {

    const memberRole = member.guild.roles.cache.get(introductoryRoleID);

    if (!memberRole) {
        console.warn("Cannot find the role, does the guildID match, or is there an issue with the server?");
        return;
    }
    member.roles.add(memberRole)
        .then(() => console.log("Assigned the role to ${members.user.tag}"))
        .catch(console.error);
})

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.on(Events.InteractionCreate, async interaction => {
    console.log("RoleSelection started");

    if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ButtonBuilder.Type) {
        const roleID = roleButtonMapping[interaction.customId];
        if (!roleID) {
            console.log(`No role found for customId: ${interaction.customId}`);
            await interaction.reply({ content: 'This button is not associated with a role.', ephemeral: true });
            return;
        }

        const role = interaction.guild.roles.cache.get(roleID);
        if (!role) {
            console.log(`Role with ID ${roleID} not found in guild.`);
            await interaction.reply({ content: 'Role not found!', ephemeral: true });
            return;
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (member.roles.cache.has(roleID)) {
            await interaction.reply({ content: `You already have the ${role.name} role!`, ephemeral: true });
        } else {
            try {
                await member.roles.add(role);
                console.log(`Role ${role.name} added to user ${member.user.tag}.`);
                await interaction.reply({ content: `You have been given the ${role.name} role!`, ephemeral: true });
            } catch (error) {
                console.error(`Error adding role ${role.name} to user ${member.user.tag}:`, error);
                await interaction.reply({ content: 'There was an error while assigning the role.', ephemeral: true });
            }
        }

    } else if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
});

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

// Check connection to mongoose
(async() => {
    console.log("Connecting to server");
    console.log("Server URL: " + process.env.MONGODBU);
    try {
        await connect(process.env.MONGODBU);
        console.log("Connected to MONGODB Server");
    } catch (error) {
        console.error("Error Connecting to MONGODB:", error);
    }
})();