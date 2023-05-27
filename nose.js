const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./secrets.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [
  {
    name: 'edit-welcome',
    description: 'Edita el mensaje de bienvenida',
    options: [
      {
        name: 'titulo',
        type: 'STRING',
        description: 'Nuevo título para el mensaje de bienvenida',
        required: true,
      },
      {
        name: 'descripcion',
        type: 'STRING',
        description: 'Nueva descripción para el mensaje de bienvenida',
        required: true,
      },
      {
        name: 'color',
        type: 'STRING',
        description: 'Nuevo color para el mensaje de bienvenida (en formato hexadecimal)',
        required: true,
      },
    ],
  },
];

client.once('ready', async () => {
  console.log('¡Bot listo!');
  try {
    const rest = new REST({ version: '9' }).setToken(token);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log('¡Comandos slash registrados!');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'edit-welcome') {
    const titulo = options.getString('titulo');
    const descripcion = options.getString('descripcion');
    const color = options.getString('color');

    // Aquí debes obtener el mensaje de bienvenida y su embed correspondiente
    // Puedes usar el método interaction.reply() para responder al comando con un mensaje

    // Edita los campos del embed según los valores proporcionados
    embed.setTitle(titulo);
    embed.setDescription(descripcion);
    embed.setColor(color);

    // Edita el mensaje de bienvenida con el embed actualizado
    await message.edit(embed);

    await interaction.reply('¡Mensaje de bienvenida actualizado!');
  }
});

client.login(token);
