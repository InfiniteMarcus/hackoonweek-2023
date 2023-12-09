import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { getUserSavedPasswordServers } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('list-servers')
		.setDescription('Lista todos os servidores em que você tem senhas guardadas')
		.setDMPermission(true),
	dmOnly: true,
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const userServers = getUserSavedPasswordServers(interaction.user.id);

		if (!userServers) {
			interaction.reply({
				content: 'Não encontramos nenhum servidor com senhas suas guardadas. Tente registrar senhas em algum deles e tente novamente',
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Listagem de servidores com senhas suas')
			.setDescription('Abaixo estão os nomes de senhas que você registrou neste servidor.\n\nUtilize o comando `get-password` para obter o valor por trás do nome');

		const bot = interaction.client;
		embed.addFields(
			userServers.map((server, index) => {
				const guild = bot.guilds.cache.get(server.serverId);

				if (!guild) {
					return {
						name: 'none',
						value: 'none',
					};
				}

				return {
					name: `Servidor númer ${index + 1}`,
					value: server.serverId,
					inline: true,
				};
			}).filter(field => field.name !== 'none'));

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
