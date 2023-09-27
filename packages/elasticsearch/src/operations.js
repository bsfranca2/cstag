import { getClientInstance } from './client.js';

export const index = getClientInstance().index.bind(getClientInstance());

export const deleteByQuery = getClientInstance().deleteByQuery.bind(
  getClientInstance()
);

export const search = getClientInstance().search.bind(getClientInstance());
