import { defineConfig } from 'tsup';

export default defineConfig({
  // entry: ['src/index.ts'], // We're using commandline instead
  splitting: false,
  sourcemap: false,
  clean: false,
  // format: ['cjs','esm'], // We're using commandline instead
  outDir: './',
  outExtension: ({ format }) => ({
    js: `.${
        format === 'esm'
            ? 'mjs'
            : format // 'cjs' :) // iife :(
    }`,
  }),
})