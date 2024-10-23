import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'max-lines-per-function': [
        'error',
        { max: 30, skipComments: true, skipBlankLines: true },
      ],
      'max-depth': ['error', 2],
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
