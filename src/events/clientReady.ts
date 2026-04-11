import { ExtendedClient } from '../types';

export function clientReady(client: ExtendedClient): void {
  client.once('clientReady', (readyClient) => {
    console.log(`✅ PAL-9000 is online as ${readyClient.user.tag}`);
  });
}