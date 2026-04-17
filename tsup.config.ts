import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tokens/network.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  target: 'es2022',
  splitting: false,
});
