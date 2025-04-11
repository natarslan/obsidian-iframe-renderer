import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts', // Entry point for your plugin
  output: {
    dir: '.',
    format: 'cjs', // CommonJS format for Obsidian plugins
    sourcemap: 'inline', // Inline sourcemaps for debugging
  },
  plugins: [
    typescript(), // Compile TypeScript to JavaScript
  ],
  external: ['obsidian'], // Exclude Obsidian from the bundle
};