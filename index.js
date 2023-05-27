const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const { token } = require('./secrets.json');
const fs = require('fs');
const db = require('megadb');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashCommands = new Map();
const slashCommandsFiles = fs.readdirSync('./slashcmd').filter((file) => file.endsWith('.js'));

// Carga los comandos slash desde la carpeta slashcmd y los guarda en un Map
for (const file of slashCommandsFiles) {
  const slash = require(`./slashcmd/${file}`);
  console.log(`El comando slash ${file} ha sido cargado.`);
  client.slashCommands.set(slash.data.name, slash);
}

client.on('ready', () => {
  console.log(`Conectado como ${client.user.tag}`);

  // Cambiar el nombre del bot
  client.user
    .setUsername('Eternum')
    .then(() => console.log('Eternum'))
    .catch(console.error);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.on('guildMemberAdd', async (member) => {
  const str = await db.get(member.guild.id) || `Bienvenido <@${member.id}>!`;

  const ch = await client.channels.fetch('ID del canal');

  const embed = new MessageEmbed()
    .setTitle('NUEVO MIEMBRO!')
    .setDescription(`${str}`)
    .setColor('RANDOM');

  await ch.send({ embeds: [embed] });
});

client.login(token);
