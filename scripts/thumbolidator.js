#!/usr/bin/env node

const fsp = require('fs').promises;
const path = require('path');
const Thumbolidate = require('./thumbolidate');
const parseArgs = require('minimist');

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
if (!srcPath) {
  console.error('directory is required');
  process.exit(-1);
}

const exts = ['.jpeg', '.jpg'];
const { MICROTILESIZE = 16, TILESIZE = 128, GRIDSIZE = 16, QUALITY = 75 } = process.env;
const MAX_LEN = GRIDSIZE * GRIDSIZE;

const thumbolidate = async (dir) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const info = files.reduce(
    (ret, file) => {
      const parsed = path.parse(file.name);
      if (parsed.base[0] === '.') return ret;
      if (file.isDirectory()) {
        ret.directories.push(parsed.base);
      } else if (exts.includes(parsed.ext.toLowerCase())) {
        ret.files.push(parsed.base);
      }
      return ret;
    },
    { files: [], directories: [] }
  );
  // console.log(info);

  const instance = new Thumbolidate({
    tileSize: TILESIZE,
    gridSize: GRIDSIZE,
    path: dir,
    ...info,
  });


  console.log(instance);

  await instance.build();

  if (recursive) {
    await instance.directories.reduce(async (p, subdir) => {
      await p;
      return thumbolidate(path.resolve(dir, subdir));
    }, null);
  }
};

thumbolidate(srcPath);
