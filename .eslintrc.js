require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  extends: ['@totominc/react'],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },

  rules: {
    "unicorn/prefer-top-level-await": "off",
    "class-methods-use-this": "off",
    "no-console": "off",
  },
};