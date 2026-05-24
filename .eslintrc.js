module.exports = {
  root: true,
  
  extends: '@react-native',
  plugins: ['react-native'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'error', 
    'react-native/no-raw-text': 'error',
    'react-native/no-color-literals': 'warn', 

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
