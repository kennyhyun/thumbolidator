import path from 'path';
import { writeFile } from 'fs';
import { promisify } from 'util';

import { saveThumbnails, makeMicroFromThumb, makeThumbnails } from './thumb';

const writeFileAsync = promisify(writeFile);

const { THUMBNAIL_NAME = '.thumbolildate' } = process.env;

export class Thumbolidate {
  constructor({ tileSize = 64, gridSize = 4, files, path: _path }) {
    if (!_path) throw new Error('path is required');
    if (!files || !files.length) throw new Error('invalid files');
    this.tileSize = tileSize;
    this.gridSize = gridSize;
    this.files = [...files];
    this.path = _path;
  }

  async build() {
    await this._dumpThumbo();
    await this.files.reduce(async (p, file, idx) => {
      await p;
      const thumbo = await makeThumbnails(file, { path: this.path, size: this.tileSize }); // exec imgk .thumbo, .micro
      const thumbname = await saveThumbnails(thumbo, {
        path: this.path,
        tileSize: this.tileSize,
        gridSize: this.gridSize,
        index: idx,
      }); // crop/drop .thumbo, .micro into target
      if (idx === this.files.length - 1) {
        // TODO: remove .thumbo, .micro jpg
        await makeMicroFromThumb(thumbname, { path: this.path, gridSize: this.gridSize });
      }
    }, null);
  }

  _dump() {
    const lines = [];
    lines.push(`#thumbolidate:${this.tileSize}:${this.gridSize}`);
    this.files.forEach(f => lines.push(` ${f}`));
    return lines.join('\n');
  }

  _thumboFileName() {
    console.log(this);
    return path.resolve(this.path, THUMBNAIL_NAME);
  }

  _dumpThumbo() {
    return writeFileAsync(this._thumboFileName(), this._dump());
  }
}
