require('esbuild').build({
  banner: {
    js: '#!/usr/bin/env node'
  },
  bundle: true,
  entryPoints: ['./src/index.js'],
  logLevel: 'info',
  outfile: 'bin',
  platform: 'node',
}).catch(() => process.exit(1))