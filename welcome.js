const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('megadb');

const embeddb = new db.crearDB('embeddb');

const data = new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Edita los valores del embed')
    .addStringOption(option =>
        option.setName('titulo')
            .setDescription('El nuevo título del embed')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('descripcion')
            .setDescription('La nueva descripción del embed')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('color')
            .setDescription('El nuevo color del embed (en formato hexadecimal)')
            .setRequired(true));

module.exports = {
    async execute(interaction) {
        const titulo = interaction.options.getString('titulo');
        const descripcion = interaction.options.getString('descripcion');
        const color = interaction.options.getString('color');

        if (!titulo || !descripcion || !color) {
            return interaction.reply({ content: 'Faltan parámetros para editar el embed.', ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor(color);

        try {
            await embeddb.set(interaction.guildId, embed);
            interaction.reply({ content: '¡Embed editado correctamente!', ephemeral: true });
        } catch (error) {
            console.error('Error al editar el embed:', error);
            interaction.reply({ content: 'Ocurrió un error al editar el embed.', ephemeral: true });
        }
    }
};
