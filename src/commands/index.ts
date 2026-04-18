import { Collection } from 'discord.js';
import { Command, ExtendedClient } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(client: ExtendedClient): Promise<void> {
  client.commands = new Collection<string, Command>();

  const commandsPath = path.join(__dirname);

  // Load root level command files
  const ext = __filename.endsWith('.ts') ? '.ts' : '.js';
const commandFiles = fs.readdirSync(commandsPath).filter(
  file => file.endsWith(ext) && file !== `index${ext}`
);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command as Command);
      console.log(`Loaded command: ${command.data.name}`);
    }
  }

  // Load commands from subfolders
  const subfolders = fs.readdirSync(commandsPath).filter(
    file => fs.statSync(path.join(commandsPath, file)).isDirectory()
  );

  for (const folder of subfolders) {
    const indexPath = path.join(commandsPath, folder, `index${ext}`);
    if (fs.existsSync(indexPath)) {
      const command = await import(indexPath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command as Command);
        console.log(`Loaded command from subfolder: ${command.data.name}`);
      } else {
        console.warn(`⚠️ Command at ${indexPath} is missing required properties.`);
      }
    }
  }
}