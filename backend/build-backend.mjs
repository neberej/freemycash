// build-backend.mjs
import { build } from 'esbuild';

await build({
  entryPoints: ['backend/server.ts'],
  outfile: './backend/dist/server.js',
  platform: 'node',
  target: 'node18',
  bundle: true,
  format: 'cjs',
  sourcemap: true,
  treeShaking: false,
});
