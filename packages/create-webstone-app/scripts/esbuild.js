const config = {
  shared: {
    banner: {
      js: '#!/usr/bin/env node'
    },
    entryPoints: ['./src/index.js'],
    logLevel: 'info',
    outfile: 'bin',
    platform: 'node',
  },
  build: {
    bundle: true,
  },
  dev: {
    watch: true,
  },
};

const mode = process.argv[2];
if (!mode) {
  console.error('Usage: node ./scripts/esbuild.js build|dev');
  process.exit(1);
}

require('esbuild').build({
  ...config.shared,
  ...config[mode] || {},
}).catch(() => process.exit(1))