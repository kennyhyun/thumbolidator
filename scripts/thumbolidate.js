const path = require('path');
const fsp = require('fs').promises;

const { saveThumbnail, makeMicroFromThumb, makeThumbnail } = require('./thumb');

const { THUMBNAIL_NAME = '.thumbolidate' } = process.env;

const chunk = (array, size) => {
  if (!array) return [];
  const firstChunk = array.slice(0, size); // create the first chunk of the given array
  if (!firstChunk.length) {
    return array; // this is the base case to terminal the recursive
  }
  return [firstChunk].concat(chunk(array.slice(size, array.length), size));
};

class Thumbolidate {
  constructor({ tileSize = 64, gridSize = 4, files = [], directories = [], path: _path }) {
    if (!_path) throw new Error('path is required');
    if (!files || !directories) throw new Error('invalid files/directories');
    this.tileSize = tileSize;
    this.gridSize = gridSize;
    this.files = [...files];
    this.directories = [...directories];
    this.path = _path;
  }

  async build() {
    await this._dumpThumbo();
    const chunks = chunk(this.files, this.gridSize * this.gridSize);
    return chunks.reduce(async (p, files, idx) => {
      await p;
      return this._processFiles(files, idx);
    }, null);
  }

  _processFiles(files = [], page = 0) {
    return files.reduce(async (p, file, idx) => {
      const previousThumbname = await p;
      const thumbname = await makeThumbnail(file, { path: this.path, size: this.tileSize })
        .then(thumbo => {
          if (!thumbo) return null;
          return saveThumbnail(thumbo, {
            path: this.path,
            tileSize: this.tileSize,
            gridSize: this.gridSize,
            index: idx,
            page,
          });
        });
      const filename = thumbname || previousThumbname;
      if (filename && idx === files.length - 1) {
        // TODO: remove .thumbo, .micro jpg
        await makeMicroFromThumb(filename, { path: this.path, gridSize: this.gridSize, page });
      }
      return filename;
    }, null);
  }

  _dump() {
    const lines = [];
    lines.push(`#thumbolidate:${this.tileSize}:${this.gridSize}`);
    this.directories.forEach(f => lines.push(`d${f}`));
    this.files.forEach(f => lines.push(` ${f}`));
    return lines.join('\n');
  }

  _thumboFileName() {
    // console.log(this);
    return path.resolve(this.path, THUMBNAIL_NAME);
  }

  _dumpThumbo() {
    return fsp.writeFile(this._thumboFileName(), this._dump());
  }
}

module.exports = Thumbolidate;
