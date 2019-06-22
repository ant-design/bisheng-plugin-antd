'use strict';

module.exports = {
  extends: 'eslint-config-airbnb',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
  },
};
