import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    ignoresPatterns: ['**/build/*', '**/node_modules/*', '**/public/*']
  },
  {
    ...love,
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended
])
