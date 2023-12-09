import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { deletePasswordInServer } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('delete-password')
		.setDescription('Deleta uma senha previamente salva neste servidor')
		.setDMPermission(false)
		.addStringOption(option => option.setName('nome')
			.setDescription('Nome atrelado a senha salva')
			.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const passwordName = interaction.options.getString('nome', true);

		const hasDeleted = deletePasswordInServer(interaction.guildId, interaction.user.id, passwordName);

		if (!hasDeleted) {
			interaction.reply({
				content: 'Houve um problema ao deletar a sua senha neste servidor. Por favor tente novamente',
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Remoção de senha no servidor')
			.setDescription(`A senha de nome ${passwordName} foi deletada com sucesso neste servidor!!`);

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
