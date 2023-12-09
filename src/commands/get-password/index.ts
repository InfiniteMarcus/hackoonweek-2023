import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { getUserPasswordByPasswordName } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('get-password')
		.setDescription('Busca senha salva previamente pelo nome atribuído')
		.setDMPermission(false)
		.addStringOption(option => option.setName('nome')
			.setDescription('Nome atrelado a senha que você deseja')
			.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const passwordName = interaction.options.getString('nome', true);

		const password = getUserPasswordByPasswordName(interaction.guildId, interaction.user.id, passwordName);

		if (!password) {
			interaction.reply({
				content: `Não foi possível encontrar nenhuma senha com nome ${passwordName} neste servidor para o seu usário`,
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Busca de senha por nome')
			.setDescription(`A senha de nome ${passwordName} é: ||${password}|| (clique para revelar)`);

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
