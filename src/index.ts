import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import { ExtendedClient } from './types';
import { loadCommands } from './commands';
import { loadEvents } from './events';
import prisma from './config/database';

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
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }

  await loadCommands(client);
  loadEvents(client);
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);