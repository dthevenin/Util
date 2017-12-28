const env = process.env.NODE_ENV

const config = {
  entry: 'src/index.js',
  external: [ ],
  globals: { },
  format: 'amd',
  moduleName: 'VSUtils',
  plugins: [
  ]
}

if (env === 'production') {
}

export default config
