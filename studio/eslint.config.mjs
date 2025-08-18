import studio from '@sanity/eslint-config-studio';

export default [
  ...studio,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: true,
      },
    },
    ignores: ['dist', '.sanity', 'eslint.config.mjs', 'prettier.config.mjs'],
    rules: {
      curly: 'error',
      'func-names': ['error', 'as-needed'],
      'no-prototype-builtins': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'info', 'time', 'timeEnd', 'table'] }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
      ],
      'react/boolean-prop-naming': 'error',
      'react/button-has-type': 'error',
      'react/destructuring-assignment': ['error', 'always', { destructureInSignature: 'always' }],
      'react/prefer-stateless-function': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce', 'ternary'] }],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'typescript/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
