module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "prettier",
        "@typescript-eslint"
    ],
    "rules": {
        "prettier/prettier": "error",
        "class-methods-use-this":"off",
        "no-param-reassign": "off",
        "camelcase": "on",
        "no-unused-vars": ["error",{ "argsIgnorePattern": "next" }]    
    }
};
