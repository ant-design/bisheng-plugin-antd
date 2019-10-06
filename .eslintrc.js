module.exports = {
  parser: 'babel-eslint',
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
    'prefer-destructuring': 0,
  },
};
