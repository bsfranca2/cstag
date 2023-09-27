export const createGroupBy = (batchSize) =>
  async function* groupBy(readable) {
    const list = [];
    for await (const item of readable) {
      list.push(item);
      if (list.length >= batchSize) yield list.splice(0, batchSize);
    }
    if (list.length > 0) yield list;
  };
