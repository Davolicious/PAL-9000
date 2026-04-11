import { Collection } from 'discord.js';
import { Command, ExtendedClient } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(client: ExtendedClient): Promise<void> {
  client.commands = new Collection<string, Command>();

  const commandsPath = path.join(__dirname);
  const commandFiles = fs.readdirSync(commandsPath).filter(
    file => file.endsWith('.ts') && file !== 'index.ts'
  );

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command as Command);
    } else {
      console.warn(`⚠️ Command at ${filePath} is missing required "data" or "execute" properties.`);
    }
  }
}