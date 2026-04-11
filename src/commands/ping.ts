import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check if PAL-9000 is responsive');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply({ content: 'Pinging...' });
  const reply = await interaction.fetchReply();
  const latency = reply.createdTimestamp - interaction.createdTimestamp;
  await interaction.editReply(`🏓 Pong! Latency: ${latency}ms | API Latency: ${Math.round(interaction.client.ws.ping)}ms`);
}