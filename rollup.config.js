export default {
  input: 'src/index.js',
  external: [ ],
  output: [
    {
      file: './dist/vs_utils.js',
      name: 'vs_utils',
      globals: {},
      format: 'iife',
    },
    {
      file: './es/vs_utils.js',
      name: 'vs_utils',
      globals: {},
      format: 'es',
    },
    {
      file: './lib/vs_utils.js',
      name: 'vs_utils',
      globals: {},
      format: 'amd'
    }
  ],
  plugins: [
  ]
};
