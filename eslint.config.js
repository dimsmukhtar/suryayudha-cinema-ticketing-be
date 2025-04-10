// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript support
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Custom rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json']
      }
    },
    rules: {
      // rule tambahan
      // 'no-console': 'warn',
      // 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
      '@typescript-eslint/restrict-template-expressions': 'off'
    }
  }
]
