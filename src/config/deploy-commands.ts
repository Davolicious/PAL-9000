import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const commands: object[] = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(
  file => file.endsWith('.ts') && file !== 'index.ts'
);

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('🔄 Refreshing application commands...');

    if (process.env.NODE_ENV === 'production') {
      await rest.put(
        Routes.applicationCommands(process.env.BOT_CLIENT_ID!),
        { body: commands }
      );
      console.log('✅ Successfully registered global application commands.');
    } else {
      await rest.put(
        Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID!, process.env.GUILD_ID!),
        { body: commands }
      );
      console.log('✅ Successfully registered guild application commands.');
    }
  } catch (error) {
    console.error(error);
  }
})();