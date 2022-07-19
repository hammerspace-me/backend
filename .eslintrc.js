module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: [
          'external',
          'builtin',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [
          {
            group: 'internal',
            pattern: '@/**',
          },
          {
            group: 'builtin',
            pattern: '~/**',
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', 'tsx', '.graphql', '.js', '.jsx', '.json', '.vue'],
        map: [
          ['~', './src'],
          ['@', './src/modules'],
        ],
      },
    },
  },
};
