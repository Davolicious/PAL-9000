import {
  ChatInputCommandInteraction,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import prisma from '../../config/database';

export async function handleAddRole(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const panelId = interaction.options.getString('panelid', true);
  const role = interaction.options.getRole('role', true);
  const label = interaction.options.getString('label', true);
  const description = interaction.options.getString('description') ?? undefined;
  const emoji = interaction.options.getString('emoji') ?? undefined;

  try {
    // Find the panel
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

    if (panel.roles.length >= 25) {
      await interaction.editReply({ content: '❌ A panel can have a maximum of 25 roles.' });
      return;
    }

    // Check if role is already on the panel
    const existingRole = panel.roles.find(r => r.roleId === role.id);
    if (existingRole) {
      await interaction.editReply({ content: '❌ That role is already on this panel.' });
      return;
    }

    // Add the role to the database
    await prisma.panelRole.create({
      data: {
        panelId: panel.id,
        roleId: role.id,
        label,
        description,
        emoji,
      },
    });

    // Fetch updated panel with all roles
    const updatedPanel = await prisma.rolePanel.findUnique({
      where: { id: panelId },
      include: { roles: true },
    });

    // Rebuild the dropdown menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`rolepanel_${panel.id}`)
      .setPlaceholder('Select a role')
      .addOptions(
  updatedPanel!.roles.map(r => {
    const option = new StringSelectMenuOptionBuilder()
      .setLabel(r.label)
      .setValue(r.roleId);
    
    if (r.description) option.setDescription(r.description);
    if (r.emoji) option.setEmoji(r.emoji);
    
    return option;
  })
)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    // Rebuild the embed
    const embed = new EmbedBuilder()
      .setTitle(panel.title)
      .setColor(0x5865f2)
      .setDescription(panel.description ?? 'Select a role from the dropdown below.')
      .setFooter({ text: 'PAL-9000 Role Panel' })
      .setTimestamp();

    // Update the panel message
    const channel = interaction.guild!.channels.cache.get(panel.channelId) as TextChannel;
    const message = await channel.messages.fetch(panel.messageId);
    await message.edit({ embeds: [embed], components: [row] });

    await interaction.editReply({ content: `✅ Added ${role} to the panel!` });
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Failed to add role. Please try again.' });
  }
}