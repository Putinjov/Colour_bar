import importPlugin from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module"
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/extensions": [
        "error",
        "always",
        {
          js: "always",
          json: "always",
          ignorePackages: true
        }
      ]
    }
  }
];
