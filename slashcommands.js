const fs = require("fs");
const { Client, GatewayIntentBits, REST } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const config = require('./secrets.json');

const commands = [];
const slashCommandsFiles = fs.readdirSync("./slashcmd").filter(file => file.endsWith(".js"));

for (const file of slashCommandsFiles) {
    const slash = require(`./slashcmd/${file}`);
    commands.push(slash.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(config.token);
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await createSlash();
    console.log("Slash commands added.");
    client.destroy();
});

async function createSlash() {
    try {
        await rest.put(
            Routes.applicationCommands(config.clientId), {
                body: commands
            }
        );
    } catch (e) {
        console.error(e);
    }
}

client.login(config.token);
