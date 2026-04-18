import {
  ChatInputCommandInteraction,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import prisma from '../../config/database';

export async function handleRemoveRole(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const panelId = interaction.options.getString('panelid', true);
  const role = interaction.options.getRole('role', true);

  try {
    const panel = await prisma.rolePanel.findUnique({
      where: { id: panelId },
      include: { roles: true },
    });

    if (!panel) {
      await interaction.editReply({ content: '❌ Panel not found. Please check the panel ID.' });
      return;
    }

    if (panel.guildId !== interaction.guildId) {
      await interaction.editReply({ content: '❌ That panel does not belong to this server.' });
      return;
    }

    const panelRole = panel.roles.find(r => r.roleId === role.id);
    if (!panelRole) {
      await interaction.editReply({ content: '❌ That role is not on this panel.' });
      return;
    }

    // Remove the role from the database
    await prisma.panelRole.delete({
      where: { id: panelRole.id },
    });

    // Fetch updated panel
    const updatedPanel = await prisma.rolePanel.findUnique({
      where: { id: panelId },
      include: { roles: true },
    });

    // Rebuild the panel message
    const channel = interaction.guild!.channels.cache.get(panel.channelId) as TextChannel;
    const message = await channel.messages.fetch(panel.messageId);

    const embed = new EmbedBuilder()
      .setTitle(panel.title)
      .setColor(0x5865f2)
      .setDescription(panel.description ?? 'Select a role from the dropdown below.')
      .setFooter({ text: 'PAL-9000 Role Panel' })
      .setTimestamp();

    if (updatedPanel!.roles.length === 0) {
      // No roles left, show disabled placeholder
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('rolepanel_placeholder')
        .setPlaceholder('No roles added yet')
        .addOptions({ label: 'placeholder', value: 'placeholder' })
        .setDisabled(true);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);

      await message.edit({ embeds: [embed], components: [row] });
    } else {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`rolepanel_${panel.id}`)
        .setPlaceholder('Select a role')
        .addOptions(
          updatedPanel!.roles.map(r =>
            new StringSelectMenuOptionBuilder()
              .setLabel(r.label)
              .setValue(r.roleId)
              .setDescription(r.description ?? '')
              .setEmoji(r.emoji ?? '🔘')
          )
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);

      await message.edit({ embeds: [embed], components: [row] });
    }

    await interaction.editReply({ content: `✅ Removed ${role} from the panel.` });
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Failed to remove role. Please try again.' });
  }
}