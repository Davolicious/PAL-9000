import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.once('ready', () => {
  console.log(`✅ PAL-9000 is online as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);