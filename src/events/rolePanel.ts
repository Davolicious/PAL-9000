import {
  StringSelectMenuInteraction,
  GuildMember,
} from 'discord.js';
import prisma from '../config/database';

export async function handleRolePanelInteraction(
  interaction: StringSelectMenuInteraction
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  try {
    const panelId = interaction.customId.replace('rolepanel_', '');

    const panel = await prisma.rolePanel.findUnique({
      where: { id: panelId },
      include: { roles: true },
    });

    if (!panel) {
      await interaction.editReply({ content: '❌ This role panel no longer exists.' });
      return;
    }

    const selectedRoleId = interaction.values[0];
    const member = interaction.member as GuildMember;

    // Toggle role - remove if they have it, add if they don't
    if (member.roles.cache.has(selectedRoleId)) {
      await member.roles.remove(selectedRoleId);
      const roleName = panel.roles.find(r => r.roleId === selectedRoleId)?.label;
      await interaction.editReply({ content: `✅ Removed the **${roleName}** role.` });
    } else {
      await member.roles.add(selectedRoleId);
      const roleName = panel.roles.find(r => r.roleId === selectedRoleId)?.label;
      await interaction.editReply({ content: `✅ Gave you the **${roleName}** role.` });
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Failed to assign role. Please try again.' });
  }
}