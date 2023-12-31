import 'dotenv/config';

import { ActivityType, Client, Events, IntentsBitField, Partials } from 'discord.js';

import { getCommands, registerCommands } from './system';

const Intents = IntentsBitField.Flags;

const bot = new Client({
	presence: {
		activities: [
			{
				state: 'Protegendo as suas senhas!!',
				name: 'Protegendo as suas senhas!!',
				type: ActivityType.Custom,
			},
		],
		status: 'online',
	},
	intents: [
		Intents.Guilds,
		Intents.GuildMembers,
	],
	partials: [
		Partials.Channel, Partials.Message, Partials.Reaction,
	],
});

const commands = getCommands();

bot.on(Events.ClientReady, async () => {
	await registerCommands();
	console.log('Comecei a proteger senhas!!');
});

bot.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.user.bot)
		return;

	if (!interaction.isCommand()) {
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const anyInteraction = interaction as any;

	const commandName = anyInteraction.commandName;
	const command = commands.get(commandName);

	if (!command) {
		return;
	}

	if (command.dmOnly && interaction.guildId) {
		await interaction.reply({
			content: 'Este comando somente pode ser usado em minha DM com você',
			ephemeral: true,
		});
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
	}
});

bot.login(process.env.BOT_TOKEN);