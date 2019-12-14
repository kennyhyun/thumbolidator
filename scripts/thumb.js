const { spawn } = require('child_process');
const sharp = require('sharp');
const PATH = require('path');
const fsp = require('fs').promises;

const { JPEGTRAN_BIN = './bin/jpegtran', THUMBNAIL_NAME = '.thumbolidate', GENERATE_THUMB_DIR } = process.env;
const jpegtran = JPEGTRAN_BIN[0] === '/' ? JPEGTRAN_BIN : PATH.resolve(__dirname, JPEGTRAN_BIN);

const exec = (cmd, args) =>
  new Promise((res, rej) => {
    const subp = spawn(cmd, args);
    const cmdline = [cmd].concat(args).join(' ');
    // console.log(`running ${cmdline}`);
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

const makeThumbnail = async (filename, { path, size } = {}) => {
  const thumbo = await sharp(PATH.resolve(path, filename)).rotate();

  const thumbSize = Number(GENERATE_THUMB_DIR) || 0;
  if (thumbSize) {
    try {
      await fsp.mkdir(PATH.resolve(path, 'thumb'));
    } catch (e) {}
    const { width, height } = await thumbo.metadata();
    const autoWidth = width > height ? null : thumbSize;
    const autoHeight = width > height ? thumbSize : null;
    const buffer1 = await thumbo.resize(autoWidth, autoHeight).toBuffer();
    await fsp.writeFile(PATH.resolve(path, 'thumb', filename), buffer1);
  }

  try {
    const buffer = await thumbo.resize(size, size).toBuffer();
    await fsp.writeFile(PATH.resolve(path, tmpThumbnailName), buffer);
  } catch (e) {
    console.error(e.message);
    return null;
  }

  return tmpThumbnailName;
};

const saveThumbnail = async (filename, { path, tileSize, gridSize, index, page = 0 } = {}) => {
  const thumbnailName = `${THUMBNAIL_NAME}${page ? `.${page}` : ''}.jpg`;
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
  process.stdout.write('.');
  await exec(jpegtran, params);
  return thumbnailName;
};

const makeMicroFromThumb = async (filename, { path, size = 16, gridSize, page = 0 } = {}) => {
  const microThumbnailName = `${THUMBNAIL_NAME}.micro${page ? `.${page}` : ''}.jpg`;
  const micro = await sharp(PATH.resolve(path, filename)).resize(size * gridSize);
  // console.log('micro:', filename, '-->', microThumbnailName);
  await fsp.writeFile(PATH.resolve(path, microThumbnailName), await micro.toBuffer());
  return microThumbnailName;
};

module.exports = {
  makeThumbnail,
  saveThumbnail,
  makeMicroFromThumb,
};
