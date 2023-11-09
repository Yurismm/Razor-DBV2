require('dotenv').config();
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, InteractionType, ButtonBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });
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
    if (interaction.type === InteractionType.MessageComponent && interaction.componentType === ButtonBuilder.Type) {
        const roleID = roleButtonMapping[interaction.customId];
        if (!roleID) {
            await interaction.reply({ content: 'This button is not associated with a role.', ephemeral: true });
            return;
        }

        const role = interaction.guild.roles.cache.get(roleID);
        if (role) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (member.roles.cache.has(roleID)) {
                await interaction.reply({ content: `You already have the ${role.name} role!`, ephemeral: true });
            } else {
                await member.roles.add(role);
                await interaction.reply({ content: `You have been given the ${role.name} role!`, ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Role not found!', ephemeral: true });
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