import { Command } from 'types';
import { Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { readdirSync } from 'fs';

const commands = new Collection<string, Command>();

export function getCommands() {
	return commands;
}

export async function registerCommands() {
	const interactions: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

	const interactionsDirectories = readdirSync('./dist/commands/');
	for (const dir of interactionsDirectories) {
		const interactionsFiles = readdirSync(`./dist/commands/${dir}`).filter(file => file.endsWith('.js'));
		for (const file of interactionsFiles) {
			const inter = (await import(`../commands/${dir}/${file}`)).default;

			if (inter.data) {
				interactions.push(inter.data.toJSON());
				commands.set(inter.data.name, inter);
			}
		}
	}

	const rest = new REST({ version: '10' })
		.setToken(process.env.BOT_TOKEN as string);

	try {
		console.log('Atualizando slash commands');

		await rest.put(
			Routes.applicationCommands(process.env.BOT_ID as string),
			{ body: interactions },
		);

		console.log('Slash commands atualizados com sucesso');
	} catch (error) {
		console.error(error);
	}
}