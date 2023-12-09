import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { getUserPasswordsInServer } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('list-passwords')
		.setDescription('Lista todos os nomes de senhas que você registrou neste servidor')
		.setDMPermission(false),
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const userPasswords = getUserPasswordsInServer(interaction.guildId, interaction.user.id);

		if (!userPasswords) {
			interaction.reply({
				content: 'Não foi possível encontrar nenhuma senha para o seu usário neste servidor',
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Listagem de senhas do seu usário')
			.setDescription('Abaixo estão os nomes de senhas que você registrou neste servidor.\n\nUtilize o comando `get-password` para obter o valor por trás do nome');

		embed.addFields(
			userPasswords.passwords.map((password, index) => {
				return {
					name: `Senha número ${index + 1}`,
					value: password.name,
					inline: true,
				};
			}));

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
