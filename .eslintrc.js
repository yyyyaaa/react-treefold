module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  rules: {
    'valid-jsdoc': 2,
    'react/prop-types': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-no-undef': 2,
    'react/display-name': 0,
    'import/no-unresolved': ['error', { ignore: ['^react$'] }],
    'import/unambiguous': 0,
    'react/jsx-key': 0,
  },
  plugins: ['import', 'react'],
};
