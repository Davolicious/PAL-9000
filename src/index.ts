import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import { ExtendedClient } from './types';
import { loadCommands } from './commands';
import { loadEvents } from './events';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
}) as ExtendedClient;

async function main(): Promise<void> {
  await loadCommands(client);
  loadEvents(client);
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);