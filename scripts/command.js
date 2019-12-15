#!/usr/bin/env node

const parseArgs = require('minimist');
const thumbolidator = require('./thumbolidator');

const argv = parseArgs(process.argv.slice(2), {
  alias: { r: 'recursive' },
});
const { _: sequentials, r, ...options } = argv;
const args = sequentials.length + Object.keys(options).length;

// console.log(argv, Object.keys(argv),  args);
if (typeof options.recursive === 'string') {
  sequentials.push(options.recursive);
}

const { recursive } = options;
const [srcPath] = sequentials;

if (srcPath) {
  thumbolidator(srcPath, { recursive });
} else {
  console.error('directory is required');
  process.exit(-1);
}
