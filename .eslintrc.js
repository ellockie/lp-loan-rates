module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    "autofix",
    '@typescript-eslint',
    "react"
  ],
  extends: [
    'react-app',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  rules: {
		  "@typescript-eslint/interface-name-prefix": [1, "always"],

      "autofix/object-curly-spacing": [ 2, "always" ],
      "autofix/semi": ["error", "always"],
      "autofix/no-debugger": "error",

      "no-undef": [ 1 ],
      "space-in-parens": [ 0, "never" ],
      "template-curly-spacing": [ 2, "never" ],
      "array-bracket-spacing": [ 2, "never" ],
      "computed-property-spacing": [ 2, "never" ],
      "no-multiple-empty-lines": [ 2, { "max": 2, "maxEOF": 0, "maxBOF": 1 } ],
      "quotes": ["error", "single"],
      "quotes": [ 1, "single", "avoid-escape" ],
      "no-use-before-define": [ 2, { "functions": false } ],
      "prefer-const": 1,
      "class-methods-use-this": [ 1 ],
      "no-undef": [ 1 ],
      "no-case-declarations": [ 1 ],
      "no-return-assign": [ 1 ],
      "no-param-reassign": [ 1 ],
      "no-shadow": [ 1 ],
      "no-underscore-dangle" : [0, "always"],
      // "camelcase": [ 1 ],
      // "sort-imports": [ 1, {
      //     "ignoreCase": false,
      //     "ignoreDeclarationSort": false,
      //     "ignoreMemberSort": false,
      //     // "memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
      // }],

      "react/prefer-es6-class": 0,
      "react/jsx-filename-extension": 0,
      "react/jsx-curly-spacing": [ 2, "never" ],
      "react/jsx-indent": [ 2, 4 ],
      "react/prop-types": [ 1 ],
      "react/no-array-index-key": [ 1 ]
  },
};