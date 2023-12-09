import { SlashCommandBuilder, Interaction } from 'discord.js';

export type Command = {
    data: SlashCommandBuilder,
    dmOnly?: boolean,
    execute: (interaction: Interaction) => Promise<number>;
};