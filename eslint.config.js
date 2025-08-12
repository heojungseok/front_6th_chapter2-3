import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import perfectionist from "eslint-plugin-perfectionist"
import boundaries from "eslint-plugin-boundaries"
import eslintPluginImport from "eslint-plugin-import"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "boundaries": boundaries,
      "import": eslintPluginImport,
      "perfectionist": perfectionist,
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" },
        { type: "pages", pattern: "src/pages" },
        { type: "widgets", pattern: "src/widgets" },
        { type: "features", pattern: "src/features" },
        { type: "entities", pattern: "src/entities" },
        { type: "shared", pattern: "src/shared" },
      ],
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // FSD 경계 룰
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: ["app"], allow: ["pages", "widgets", "features", "entities", "shared"] },
            { from: ["pages"], allow: ["widgets", "features", "entities", "shared"] },
            { from: ["widgets"], allow: ["features", "entities", "shared"] },
            { from: ["features"], allow: ["entities", "shared"] },
            { from: ["entities"], allow: ["shared"] },
            { from: ["shared"], allow: ["shared"] },
          ],
        },
      ],

      // 코드 포맷팅 룰
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "builtin",
            "external",
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
          customGroups: {
            value: {
              "react": ["react", "react-*"],
              "@app": "@app/.*",
              "@pages": "@pages/.*",
              "@widgets": "@widgets/.*",
              "@features": "@features/.*",
              "@entities": "@entities/.*",
              "@shared": "@shared/.*",
            },
          },
          newlinesBetween: "always",
        },
      ],
      "perfectionist/sort-named-imports": ["error", { type: "natural" }],
      "perfectionist/sort-exports": ["error", { type: "natural" }],
      "perfectionist/sort-object-types": ["error", { type: "natural" }],
      "perfectionist/sort-interfaces": ["error", { type: "natural" }],
      "perfectionist/sort-jsx-props": ["error", { type: "natural" }],
    },
  },
)
