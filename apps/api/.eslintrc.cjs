module.exports = {
  root: true,
  extends: ['eslint-config-custom/node-library'],
  rules: {
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-process-exit': 'off',
  },
};
