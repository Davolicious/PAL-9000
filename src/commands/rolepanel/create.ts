import {
  ChatInputCommandInteraction,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import prisma from '../../config/database';

export async function handleCreate(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.options.getChannel('channel', true) as TextChannel;
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description') ?? undefined;

  try {
    // Ensure guild exists in database
    await prisma.guild.upsert({
      where: { id: interaction.guildId! },
      update: { name: interaction.guild!.name },
      create: {
        id: interaction.guildId!,
        name: interaction.guild!.name,
      },
    });

    // Create the panel embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x5865f2)
      .setDescription(description ?? 'Select a role from the dropdown below.')
      .setFooter({ text: 'PAL-9000 Role Panel' })
      .setTimestamp();

    // Create a placeholder dropdown
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('rolepanel_placeholder')
      .setPlaceholder('No roles added yet')
      .addOptions({ label: 'placeholder', value: 'placeholder' })
      .setDisabled(true);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    // Post the panel message
    const message = await channel.send({
      embeds: [embed],
      components: [row],
    });

    // Save the panel to the database
    const panel = await prisma.rolePanel.create({
      data: {
        guildId: interaction.guildId!,
        channelId: channel.id,
        messageId: message.id,
        title,
        description,
      },
    });

    await interaction.editReply({
      content: `✅ Role panel created in ${channel}!\nPanel ID: \`${panel.id}\`\nUse \`/rolepanel addrole\` to add roles to it.`,
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: '❌ Failed to create role panel. Please try again.',
    });
  }
}