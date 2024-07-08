module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['unused-imports', 'import'],
  extends: ['prettier', 'eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  overrides: [{ files: ['*.ts', '*.tsx'] }],
  rules: {
    indent: 'off',
    quotes: ['warn', 'single'],
    'no-unused-vars': 'off',
    'eol-last': 'warn',
    'no-redeclare': 'off',
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    'no-useless-escape': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'prettier/prettier':'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'never',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroupsExcludedImportTypes: ['internal', 'external', 'builtins'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  }
};
