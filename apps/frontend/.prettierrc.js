/**
 * Some settings are automatically inherited from .editorconfig
 * @type {import('prettier').Config}
 */
module.exports = {
  singleQuote: true,
  semi: true,
  overrides: [
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
  ],
};
