import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { Command } from '../../types';
import { insertPasswordInServer } from '../../system';
import { DEFAULT_EMBED_COLOR } from '../../constants';

export default {
	data: new SlashCommandBuilder()
		.setName('save-password')
		.setDescription('Salva uma senha neste servidor')
		.setDMPermission(false)
		.addStringOption(option => option.setName('nome')
			.setDescription('Nome atrelado a senha que você deseja')
			.setRequired(true),
		)
		.addStringOption(option => option.setName('senha')
			.setDescription('Texto da senha que será salva com o nome que você escolheu')
			.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.isChatInputCommand() || !interaction.guildId)
			return 0;

		const passwordName = interaction.options.getString('nome', true);
		const passwordValue = interaction.options.getString('senha', true);

		const hasInserted = insertPasswordInServer(interaction.guildId, interaction.user.id, {
			name: passwordName,
			password: passwordValue,
		});

		if (!hasInserted) {
			interaction.reply({
				content: 'Houve um problema ao salvar a sua senha neste servidor. Por favor tente novamente',
				ephemeral: true,
			});
			return 0;
		}

		const embed = new EmbedBuilder()
			.setColor(DEFAULT_EMBED_COLOR)
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTitle('Inserção de senha no servidor')
			.setDescription(`A senha de nome ${passwordName} foi inserida com sucesso neste servidor!!`);

		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});

		return 1;
	},
} as Command;
