module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'eslint:recommended',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "semi": [2, "always"],
    "no-console": ["error", { allow: ["warn", "error", "log"] }],
    "no-undef": 0
  },
  globals: {}
}
