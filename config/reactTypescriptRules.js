module.exports = {
  // Append 'tsx' to Airbnb 'react/jsx-filename-extension' rule
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
  'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],

  // turn of react prop types as we type with typescript
  'react/prop-types': 'off',
};
