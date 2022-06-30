import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/client/index.ts',
  output: {
    name: 'nodecg-twitchie',
    dir: './lib',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'lib/',
      rootDir: 'src/',
      module: 'es6',
    }),
  ],
}
