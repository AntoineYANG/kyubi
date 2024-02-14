import { type Options, defineConfig } from "tsup";


const common = (options: Options) => ({
  target: 'es2020',
  format: 'cjs',
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  minify: !options.watch,
}) satisfies Parameters<typeof defineConfig>[0];

export default defineConfig(options => [
  {
    name: 'kyubi',
    ...common(options),
  },
  {
    name: 'kyubi-esm',
    ...common(options),
    format: 'esm',
  },
  {
    name: 'kyubi-loader',
    ...common(options),
    entry: ['src/loader.ts'],
    dts: false,
  },
]);
