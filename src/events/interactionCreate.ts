import { Interaction, StringSelectMenuInteraction } from 'discord.js';
import { ExtendedClient } from '../types';
import { handleRolePanelInteraction } from './rolePanel';

export function interactionCreate(client: ExtendedClient): void {
  client.on('interactionCreate', async (interaction: Interaction) => {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
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
    }

    // Handle select menu interactions
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith('rolepanel_')) {
        await handleRolePanelInteraction(interaction as StringSelectMenuInteraction);
      }
    }
  });
}