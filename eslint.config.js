const js = require('@eslint/js')
const tseslint = require( 'typescript-eslint')

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json']
      }
    },
    rules: {
      // 'no-console': 'warn',
      // 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
]
