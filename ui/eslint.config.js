import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  // Global ignore
  {
    ignores: ["dist", "build", "node_modules"],
  },

  // TS + React config
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },

    // Plugins
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // Extend (recommended TS rules)
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],

    // Rules
    rules: {
      // React hooks rules (güncel React 19 uyumlu)
      ...reactHooks.configs.recommended.rules,

      // React Fast Refresh only export components rule
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // TS unused vars rule (doğru isim bu!)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  }
);
