module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended", "airbnb-base", "prettier"],
  "plugins": ["prettier"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "class-methods-use-this":"off",
    "no-param-reassign": "off",
    "camelcase": "on",
    "no-unused-vars": ["error",{ "argsIgnorePattern": "next" }]
  }
};
