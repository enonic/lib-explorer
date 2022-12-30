import { defineConfig } from 'tsup';

export default defineConfig({
  clean: false,
  // entry: ['src/index.ts'], // We're using commandline instead
  // format: ['cjs','esm'], // We're using commandline instead
  outDir: './',
  outExtension: ({ format }) => ({
    js: `.${
        format === 'esm'
            ? 'mjs'
            : format // 'cjs' :) // iife :(
    }`,
  }),
  silent: true,
  sourcemap: false,
  splitting: false,
})