import { getChannel, closeChannel } from './channel.js';
import { closeClient } from './client.js';
import { queues } from './config.js';

const _defaultArgs = {
  prefetch: 10,
};
export async function startConnection({ prefetch } = _defaultArgs) {
  const channel = await getChannel();
  channel.addSetup((channel) => {
    return Promise.all([
      channel.prefetch(prefetch),
      ...Object.values(queues).map((queue) =>
        channel.assertQueue(queue, {
          durable: true,
        })
      ),
    ]);
  });
  await channel.waitForConnect();
}

export async function closeConnection() {
  await closeChannel();
  await closeClient();
}

export async function registerConsumer(queue, consumer) {
  const channelWrapper = await getChannel();
  channelWrapper.addSetup((channel) => {
    return channel.consume(queue, async (message) => {
      await consumer(JSON.parse(message.content.toString()));
      channel.ack(message);
    });
  });
}

export async function sendToQueue(queue, message) {
  const channel = await getChannel();
  await channel.sendToQueue(queue, message);
}

export { getClient, closeClient } from './client.js';
export { getChannel, closeChannel } from './channel.js';
export { queues } from './config.js';

/// TODO: implement reconnect
