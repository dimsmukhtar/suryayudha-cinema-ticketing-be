import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import love from 'eslint-config-love'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig([
  // JavaScript config
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: ['**/build/*', '**/node_modules/*', '**/public/*'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    ...love
  },

  // TypeScript config with type checking
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/build/*', '**/node_modules/*', '**/public/*', 'eslint.config.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      },
      globals: globals.node
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Use 'recommended' instead of 'recommendedTypeChecked' for non-type-checking rules
      ...tseslint.configs.recommended.rules
    }
  },

  // Additional TypeScript config for type-aware rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      '**/build/*',
      '**/node_modules/*',
      '**/public/*',
      'eslint.config.js',
      'eslint.config.mjs'
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      // Only include type-checking rules here
      ...tseslint.configs.recommendedTypeChecked.rules
    }
  }
])
