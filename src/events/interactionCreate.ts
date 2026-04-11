import { Interaction } from 'discord.js';
import { ExtendedClient } from '../types';

export function interactionCreate(client: ExtendedClient): void {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      });
    }
  });
}