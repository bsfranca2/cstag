module.exports = {
  plugins: ['unicorn'],
  extends: ['standard', 'plugin:unicorn/recommended', 'prettier'],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    // https://basarat.gitbook.io/typescript/main-1/defaultisbad
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    // Use function hoisting to improve code readability
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    // Airbnb prefers forEach
    'unicorn/no-array-for-each': 'off',
    // No-null
    'unicorn/no-null': 'off',
    // Sort imports
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'unknown',
        ],
        'newlines-between': 'ignore',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  ignorePatterns: ['node_modules', '.turbo', 'dist', 'coverage'],
};
