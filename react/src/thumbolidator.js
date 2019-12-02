import memoize from 'lodash/memoize';
import PATH from 'path';

const storage = sessionStorage;

const config = { thumbnailName: '.thumbolidate' };

export const setConfig = options => {
  Object.keys(config).forEach(key => {
    if (options.hasOwnProperty(key)) {
      config[key] = options[key];
    }
  });
};

class Thumbolidator {
  constructor(albumUrl) {
    if (!albumUrl) throw new Error('albumUrl is required');
    this.url = albumUrl;
    if (this.url.slice(-1)[0] !== '/') {
      this.url = `${this.url}/`;
    }
    const url = new URL(this.url);
    this.dirname = url.pathname;

    url.pathname = PATH.join(this.dirname, `${config.thumbnailName}.jpg`);
    this.thumboUrl = url.href;

    url.pathname = PATH.join(this.dirname, `${config.thumbnailName}.micro.jpg`);
    this.microUrl = url.href;

    this.bgSize = memoize(this._bgSize);
    this.bgPosition = memoize(this._bgPosition);
    this.storageKey = `thumbolidator:${this.url}`;
    this.requestPromise = this._requestThumbolidate();
  }

  getDummyThumboElement(url) {
    if (this.dummyThumbo) return this.dummyThumbo;
    const dummy = document.createElement('img');
    dummy.style.display = 'none';
    const promise = new Promise(res => {
      dummy.onload = res;
    });
    this.dummyThumbo = { element: dummy, promise };
    return this.dummyThumbo;
  }

  getDummyMicroElement(url) {
    if (this.dummyMicro) return this.dummyMicro;
    const dummy = document.createElement('img');
    dummy.src = this.microUrl;
    dummy.style.display = 'none';
    const promise = new Promise(res => {
      dummy.onload = () => {
        this.dummyThumbo.element.src = this.thumboUrl;
        res();
      };
    });
    this.dummyMicro = { element: dummy, promise };
    return this.dummyMicro;
  }

  _setData(data) {
    const lines = data.split('\n');
    const [, tileSize, gridSize] = lines[0].split(':');
    const files = lines.slice(1);
    const map = files.reduce((o, file, idx) => {
      o[encodeURI(file.substr(1))] = idx;
      return o;
    }, {});
    this.data = { tileSize: Number(tileSize), gridSize: Number(gridSize) };
    this.files = files;
    this.map = map;
  }

  _requestThumbolidate() {
    if (this.request) return this.request;
    // for an earlier resolving while page reloading
    let data = storage.getItem(this.storageKey);
    if (data) this._setData(data);
    this.request = fetch(this.url).then(async r => {
      const _data = await r.text();
      // console.log('!!', this.url, _data);
      this._setData(_data);
      setTimeout(() => {
        storage.setItem(this.storageKey, _data);
      }, 0);
    });
    return this.request;
  }

  _bgSize({ tileSize, gridSize, size }) {
    const scale = size / tileSize;
    return tileSize * gridSize * scale;
  }

  _bgPosition({ tileSize, row, col, size }) {
    const scale = size / tileSize;
    return { x: tileSize * col * scale, y: tileSize * row * scale };
  }

  _cssParams({ size, filename }) {
    if (!this.data) {
      return {};
    }
    const { tileSize, gridSize } = this.data;
    const idx = this.map[filename];
    const col = idx % gridSize;
    const row = parseInt(idx / gridSize, 10);
    // console.log(filename, idx, col, row, gridSize, tileSize);
    return { size, tileSize, gridSize, col, row };
  }

  _css({ tileSize, gridSize, size, row, col }, style) {
    const sizeOpt = { tileSize, gridSize, size };
    const position = this.bgPosition({ tileSize, gridSize, row, col, size });
    return {
      width: this.bgSize(sizeOpt),
      height: this.bgSize(sizeOpt),
      left: -position.x,
      top: -position.y,
      position: 'absolute',
      ...style,
    };
  }

  microCss(cssParams, style) {
    try {
      const { col, row, gridSize, size } = this._cssParams(cssParams);
      return this._css({ tileSize: 16, gridSize, size, row, col }, style);
    } catch (e) {
      return {
        // loading
        backgroundColor: 'orange',
        opacity: 0.2,
        ...style,
      };
    }
  }

  thumboCss(cssParams, style) {
    const { col, row, tileSize, gridSize, size } = this._cssParams(cssParams);
    return this._css({ tileSize, gridSize, size, row, col }, style);
  }
}

export const getThumbolidator = memoize(path => new Thumbolidator(path));

export default Thumbolidator;