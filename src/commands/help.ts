import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ExtendedClient } from '../types';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List all available commands');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const client = interaction.client as ExtendedClient;

  const embed = new EmbedBuilder()
    .setTitle('PAL-9000 Command List')
    .setColor(0x00ff00)
    .setDescription('Here are all available commands:')
    .setTimestamp()
    .setFooter({ text: 'PAL-9000' });

  client.commands.forEach((command) => {
    embed.addFields({
      name: `/${command.data.name}`,
      value: command.data.description,
    });
  });

  await interaction.reply({ embeds: [embed] });
}