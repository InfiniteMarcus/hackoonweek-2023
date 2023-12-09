import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { changeMasterPassword } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('create-master-password')
		.setDescription('Cria uma senha mestra para o seu gerenciador de senhas')
		.setDMPermission(false)
		.addStringOption(option => option.setName('senha-mestra')
			.setDescription('Senha mestra que será usada para acessar ou alterar dados das suas senhas no bot')
			.setRequired(true),
		),
	dmOnly: true,
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const masterPassword = interaction.options.getString('senha-mestra', true);
		const userServers = changeMasterPassword(interaction.user.id, masterPassword);

		if (!userServers) {
			interaction.reply({
				content: 'Não foi possível salvar sua senha mestra. Tente novamente',
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Criação de senha mestra')
			.setDescription(`Senha mestra salva com sucesso.\n\n**ATENÇÃO, ANOTE ELA PARA NÃO PERDE-LA:** ${masterPassword}`);

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
