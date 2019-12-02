#!/usr/bin/env node

const { writeFileSync, readdir } = require('fs');
const path = require('path');
const { promisify } = require('util');
const Thumbolidate = require('./thumbolidate');

const readdirAsync = promisify(readdir);

const [, , srcPath] = process.argv;

const exts = ['.jpeg', '.jpg'];
const { MICROTILESIZE = 16, TILESIZE = 128, GRIDSIZE = 16, QUALITY = 75 } = process.env;
const MAX_LEN = GRIDSIZE * GRIDSIZE;

(async () => {
  const files = await readdirAsync(srcPath);
  const jpegInfo = files
    .map(f => path.parse(f))
    .filter(f => f.name[0] !== '.' && exts.includes(f.ext.toLowerCase()))
    .slice(0, MAX_LEN);

  const thumbolidate = new Thumbolidate({
    tileSize: TILESIZE,
    gridSize: GRIDSIZE,
    files: jpegInfo.map(it => it.base),
    path: srcPath,
  });

  console.log(thumbolidate);

  await thumbolidate.build();
})();
