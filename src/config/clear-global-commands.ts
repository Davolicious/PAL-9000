import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('🔄 Clearing global commands...');
    await rest.put(
      Routes.applicationCommands(process.env.BOT_CLIENT_ID!),
      { body: [] }
    );
    console.log('✅ Successfully cleared global commands.');
  } catch (error) {
    console.error(error);
  }
})();