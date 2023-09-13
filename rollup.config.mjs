import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: `src/utils/index.ts`,
    plugins: [esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      tsconfig: 'src/tsconfig.json'
    })],
    output: [
      {
        file: `dist/vs_utils.es.js`,
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: `dist/vs_utils.amd.js`,
        format: 'amd',
        sourcemap: true,
        exports: 'named',
        name: 'vs_utils',
      },
    ]
  },
  {
    input: `build/utils/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `dist/vs_utils.d.ts`,
      format: 'es',
    },
  }
];