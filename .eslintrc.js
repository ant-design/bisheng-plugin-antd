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
};
