/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },

  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-deprecated': 'off',
    // We have to disable it because server actions needs to be async even if they don't use promises inside
    '@typescript-eslint/require-await': 'off',
  },
  ignorePatterns: ['src-old'],
};
