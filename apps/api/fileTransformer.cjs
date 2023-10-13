module.exports = {
  process(sourceText, sourcePath, options) {
    console.log('runningg transformer');
    return {
      code: `throw new Error('parsing...')`,
    };
  },
};
