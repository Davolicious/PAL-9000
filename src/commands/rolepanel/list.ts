import {
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import prisma from '../../config/database';

export async function handleList(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  try {
    const panels = await prisma.rolePanel.findMany({
      where: { guildId: interaction.guildId! },
      include: { roles: true },
    });

    if (panels.length === 0) {
      await interaction.editReply({ content: 'No role panels found in this server.' });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('Role Panels')
      .setColor(0x5865f2)
      .setFooter({ text: 'PAL-9000 Role Panel' })
      .setTimestamp();

    panels.forEach(panel => {
      embed.addFields({
        name: `${panel.title}`,
        value: [
          `**ID:** \`${panel.id}\``,
          `**Channel:** <#${panel.channelId}>`,
          `**Roles:** ${panel.roles.length > 0 ? panel.roles.map(r => `<@&${r.roleId}>`).join(', ') : 'None'}`,
        ].join('\n'),
      });
    });

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content: '❌ Failed to fetch role panels. Please try again.' });
  }
}