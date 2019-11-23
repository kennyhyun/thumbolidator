import { spawn } from 'child_process';
import sharp from 'sharp';
import PATH from 'path';
import { mkdir, writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const { THUMBNAIL_NAME = '.thumbolidate', GENERATE_THUMB_DIR } = process.env;

const exec = (cmd, args) =>
  new Promise((res, rej) => {
    const subp = spawn(cmd, args);
    const cmdline = [cmd].concat(args).join(' ');
    console.log(`running ${cmdline}`);
    subp.stdout.on('data', data => {
      console.log(`${cmdline}: ${data}`);
    });
    subp.stderr.on('data', data => {
      console.log(`stderr ${cmdline}: ${data}`);
    });
    subp.on('error', err => {
      rej(new Error(err));
    });
    subp.on('close', code => {
      res(code);
    });
  });

// const tmpMicroThumbnailName = '.micro';
const tmpThumbnailName = '.thumbo';
const thumbnailName = `${THUMBNAIL_NAME}.jpg`;
const microThumbnailName = `${THUMBNAIL_NAME}.micro.jpg`;

export const makeThumbnails = async (filename, { path, size } = {}) => {
  const thumbo = await sharp(PATH.resolve(path, filename)).rotate();

  const thumbSize = Number(GENERATE_THUMB_DIR) || 0;
  if (thumbSize) {
    try {
      await mkdirAsync(PATH.resolve(path, 'thumb'));
    } catch (e) {}
    const { width, height } = await thumbo.metadata();
    const autoWidth = width > height ? null : thumbSize;
    const autoHeight = width > height ? thumbSize : null;
    const buffer1 = await thumbo.resize(autoWidth, autoHeight).toBuffer();
    await writeFileAsync(PATH.resolve(path, 'thumb', filename), buffer1);
  }

  const buffer = await thumbo.resize(size, size).toBuffer();
  await writeFileAsync(PATH.resolve(path, tmpThumbnailName), buffer);

  return tmpThumbnailName;
};

export const saveThumbnails = async (filename, { path, tileSize, gridSize, index } = {}) => {
  const crop = index === 0;
  const row = parseInt(index / gridSize, 10);
  const col = index % gridSize;
  const outputSize = tileSize * gridSize;
  const left = col * tileSize;
  const top = row * tileSize;
  const params = [crop ? '-crop' : '-drop', crop ? `${outputSize}x${outputSize}+0+0` : `+${left}+${top}`];
  if (!crop) params.push(PATH.resolve(path, filename));
  params.push('-outfile', PATH.resolve(path, thumbnailName));
  params.push(crop ? PATH.resolve(path, filename) : PATH.resolve(path, thumbnailName));
  await exec('./bin/jpegtran', params);
  return thumbnailName;
};

export const makeMicroFromThumb = async (filename, { path, size = 16, gridSize } = {}) => {
  const micro = await sharp(PATH.resolve(path, filename)).resize(size * gridSize);
  await writeFileAsync(PATH.resolve(path, microThumbnailName), await micro.toBuffer());
  return microThumbnailName;
};
