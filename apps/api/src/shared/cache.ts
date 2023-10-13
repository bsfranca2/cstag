import { createStorage, prefixStorage, type Storage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';

import { UserCached } from '~/users';

const cache = createStorage({
  driver: memoryDriver(),
});

export const userCache: Storage<UserCached | string> = prefixStorage(cache, 'user');
