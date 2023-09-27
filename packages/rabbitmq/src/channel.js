import { getClient } from './client.js';

/** @type {import("amqp-connection-manager").ChannelWrapper|null} */
let channelWrapper = null;
export async function getChannel() {
  if (!channelWrapper) {
    const client = await getClient();
    channelWrapper = client.createChannel({ json: true });
  }
  return channelWrapper;
}

export async function closeChannel() {
  if (channelWrapper) {
    // eslint-disable-next-line unicorn/no-await-expression-member
    await (await getChannel()).close();
    channelWrapper = null;
  }
}
