import { ExtendedClient } from '../types';
import { clientReady } from './clientReady';
import { interactionCreate } from './interactionCreate';

export function loadEvents(client: ExtendedClient): void {
  clientReady(client);
  interactionCreate(client);
}