module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    jest: true,
    jasmine: true,
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      webpack: {
        config: "./config/webpack.config.js",
      },
    },
  },
  rules: {
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", args: "all" },
    ],
    "no-console": "warn",
    "import/no-default-export": "error",
    "import/first": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    "default-case": "off",
    "prettier/prettier": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "react/sort-comp": "off",
        "react/prop-types": "off",
      },
    },
  ],
}
