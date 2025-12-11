import js from "@eslint/js";
import importeslint from "eslint-plugin-import";
import reacteslint from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "vite.config.ts", "eslint.config.mjs"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      "import/resolver": {
        typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: reacteslint,
      import: importeslint,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // React
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/jsx-props-no-spreading": "off",
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
      "react/destructuring-assignment": ["error", "always"],
      "no-else-return": "error",

      // Imports
      "no-duplicate-imports": ["error", { includeExports: true }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      "import/no-cycle": ["error", { maxDepth: 2 }],
      "import/no-unresolved": "error",
      "import/first": "error",
      "import/no-deprecated": "error",
      "import/no-duplicates": "error",
      "import/prefer-default-export": "off",
      "import/no-named-as-default-member": "warn",
      "import/no-named-as-default": "error",
      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            ["internal", "parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Code style
      indent: ["error", 2, { SwitchCase: 1 }],
      semi: ["error", "always"],
    },
  }
);
