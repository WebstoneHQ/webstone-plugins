import { defineConfig, build } from 'tsup';
import jetpack from 'fs-jetpack';

/**
 * //type {"build" | "dev"}
 */
const mode = process.argv[2];

// check if mode is valid
if (!['build', 'dev'].includes(mode)) {
	console.log('Invalid mode');
	process.exit(1);
}

const config = defineConfig({
	entry: ['src/cli/**/*.ts'],
	outDir: 'dist/cli',
	splitting: true,
	target: 'es6',
	format: 'cjs',
	clean: true,
	treeshake: true,
	tsconfig: './tsconfig.json',
	bundle: false,
	minify: true,
	watch: mode === 'dev' ? ['src/cli'] : false
});

const tsFiles = jetpack.cwd('src/cli').find({ matching: '*.ts', recursive: true });
const tsFilesCount = tsFiles.length;
if (tsFilesCount === 0) {
	console.log('No files to build');
	process.exit(1);
}
await build(config);
