module.exports = {
  root: true,
  extends: ['eslint-config-custom/node-library'],
  rules: {
    'import/no-default-export': 'off',
    'unicorn/no-array-reduce': 'off',
  },
};
