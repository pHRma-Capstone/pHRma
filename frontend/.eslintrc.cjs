/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'max-len': [
      'error',
      {
        code: 150
      }
    ],
    'vue/comment-directive': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: true,
        ignores: []
      }
    ]
  },
  env: {
    node: true
  },
  // https://github.com/vuejs/eslint-plugin-vue/issues/1355
  overrides: [
    {
      files: ['*.html'],
      rules: {
        'eslint-disable': 0
      }
    }
  ]
};
