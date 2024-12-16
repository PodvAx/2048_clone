module.exports = {
  extends: ["@mate-academy/eslint-config", "plugin:prettier/recommended"],
  env: {
    browser: true,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
