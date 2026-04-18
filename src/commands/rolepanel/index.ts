import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';
import { ExtendedClient } from '../../types';
import { handleCreate } from './create';
import { handleAddRole } from './addRole';
import { handleRemoveRole } from './removeRole';
import { handleList } from './list';

export const data = new SlashCommandBuilder()
  .setName('rolepanel')
  .setDescription('Manage role panels')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand(subcommand =>
    subcommand
      .setName('create')
      .setDescription('Create a new role panel')
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('Channel to post the role panel in')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('title')
          .setDescription('Title for the role panel')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description for the role panel')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('addrole')
      .setDescription('Add a role to an existing panel')
      .addStringOption(option =>
        option
          .setName('panelid')
          .setDescription('ID of the panel to add the role to')
          .setRequired(true)
      )
      .addRoleOption(option =>
        option
          .setName('role')
          .setDescription('Role to add')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('label')
          .setDescription('Label for the role in the dropdown')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('description')
          .setDescription('Description for the role in the dropdown')
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('emoji')
          .setDescription('Emoji for the role in the dropdown')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('removerole')
      .setDescription('Remove a role from a panel')
      .addStringOption(option =>
        option
          .setName('panelid')
          .setDescription('ID of the panel')
          .setRequired(true)
      )
      .addRoleOption(option =>
        option
          .setName('role')
          .setDescription('Role to remove')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('List all role panels in this server')
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const client = interaction.client as ExtendedClient;
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case 'create':
      await handleCreate(interaction);
      break;
    case 'addrole':
      await handleAddRole(interaction);
      break;
    case 'removerole':
      await handleRemoveRole(interaction);
      break;
    case 'list':
      await handleList(interaction);
      break;
    default:
      await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
  }
}