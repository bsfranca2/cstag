export const isCloud = !!process.env.ELASTICSEARCH_CLOUD_ID;

export const cloudId = process.env.ELASTICSEARCH_CLOUD_ID;

export const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';

export const requestTimeout = 3 * 1000;

/**
 * Get the Elasticsearch client options
 * @returns {import("@elastic/elasticsearch").ClientOptions}
 */
export const getClientOptions = () => {
  if (isCloud) {
    return {
      cloud: { id: cloudId },
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    };
  }
  return { node };
};
