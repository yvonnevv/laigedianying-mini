module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['eslint:recommended', 'taro'],
  globals: {
    __inline: true,
    IS_SERVER: true,
    __uri: true,
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'react/jsx-no-bind': 'off',
    'space-before-function-paren': 'error',
    'no-mixed-operators': 'error'
  },
};
