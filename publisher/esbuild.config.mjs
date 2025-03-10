import esbuild from 'esbuild';

const isWatchMode = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'es6',
  outfile: './dist/index.js',
  sourcemap: true,
  external: ['events', 'fs', 'path'], // 添加更多 external 选项
};

if (isWatchMode) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
  }).catch(() => process.exit(1));
} else {
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
