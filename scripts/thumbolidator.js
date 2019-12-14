#!/usr/bin/env node

const fsp = require('fs').promises;
const path = require('path');
const Thumbolidate = require('./thumbolidate');

const [, , srcPath] = process.argv;

const exts = ['.jpeg', '.jpg'];
const { MICROTILESIZE = 16, TILESIZE = 128, GRIDSIZE = 16, QUALITY = 75 } = process.env;
const MAX_LEN = GRIDSIZE * GRIDSIZE;

(async () => {
  const files = await fsp.readdir(srcPath, { withFileTypes: true });
  const info = files.reduce((ret, file) => {
    const parsed = path.parse(file.name);
    if (parsed.base[0] === '.') return ret;
    if (file.isDirectory()) {
      ret.directories.push(parsed.base);
    } else if (exts.includes(parsed.ext.toLowerCase())) {
      ret.files.push(parsed.base);
    }
    return ret;
  }, { files: [], directories: [] });
  // console.log(info);

  const thumbolidate = new Thumbolidate({
    tileSize: TILESIZE,
    gridSize: GRIDSIZE,
    path: srcPath,
    ...info,
  });

  console.log(thumbolidate);

  await thumbolidate.build();
})();
