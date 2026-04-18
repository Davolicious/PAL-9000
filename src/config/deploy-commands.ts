import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const commands: object[] = [];
const commandsPath = path.join(__dirname, '../commands');

// Get root level command files
const commandFiles = fs.readdirSync(commandsPath).filter(
  file => file.endsWith('.ts') && file !== 'index.ts'
);

// Get commands from subfolders
const subfolders = fs.readdirSync(commandsPath).filter(
  file => fs.statSync(path.join(commandsPath, file)).isDirectory()
);

console.log('Root command files:', commandFiles);
console.log('Subfolders found:', subfolders);

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`Loaded command: ${command.data.name}`);
  }
}

for (const folder of subfolders) {
  const indexPath = path.join(commandsPath, folder, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const command = require(indexPath);
    if ('data' in command) {
      commands.push(command.data.toJSON());
      console.log(`Loaded command from subfolder: ${command.data.name}`);
    }
  }
}

console.log(`Total commands to register: ${commands.length}`);

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