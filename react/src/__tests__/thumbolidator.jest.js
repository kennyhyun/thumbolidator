import Thumbolidator from '../thumbolidator';
import URL from 'url';

const mockResp = `#thumbolidate:128:16
dFolder
 DSC00001.JPG
 DSC00002.JPG
 DSC00003.JPG
 DSC00005.JPG
 DSC00006.JPG
 DSC00007.JPG
 DSC00008.JPG
 DSC00009.JPG`;

describe('Thumbolidator', () => {
  let thumbolidator;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponse(mockResp);
    thumbolidator = new Thumbolidator('http://album.com:8080/albums');
  });

  describe('constructor', () => {
    it('should raise error if no arguments', () => {
      expect(() => new Thumbolidator()).toThrow('albumUrl');
    });
    it('should return instance', () => {
      expect(thumbolidator).toBeInstanceOf(Thumbolidator);
      expect(thumbolidator).toMatchObject({
        url: expect.any(String),
        data: expect.anything(),
        files: expect.anything(),
        map: expect.anything(),
      });
      expect(thumbolidator.thumboUrl).toBeTruthy();
      expect(thumbolidator.microUrl).toBeTruthy();
      expect(thumbolidator.thumboCss).toBeTruthy();
      expect(thumbolidator.microCss).toBeTruthy();
      expect(thumbolidator.requestPromise).toBeTruthy();
      expect(thumbolidator.getDummyMicroElement).toBeTruthy();
      expect(thumbolidator.getDummyThumboElement).toBeTruthy();
    });
  });

  describe('requestPromise', () => {
    it('should await metadata and set data properly', async () => {
      await thumbolidator.requestPromise;
      const piece = { [mockResp.split('\n')[4].substr(1)]: 2 };
      expect(thumbolidator.map).toMatchObject(piece);
      // exclude header and directories
      expect(Object.keys(thumbolidator.map).length).toBe(mockResp.split('\n').length - 2);
    });

  });

  describe('thumboUrl', () => {
    it('should return url', async () => {
      await thumbolidator.requestPromise;
      const url = thumbolidator.thumboUrl();
      const parsed = URL.parse(url);
      expect(parsed.host).toBeTruthy();
      expect(url).toMatch(/.thumbolidate.jpg$/);
    });
    it('should return url for next page', async () => {
      const files = [...Array(16 * 16 + 3).keys()].map(k => ` DSC${k}.JPG`);
      const mockResp2 = `#thumbolidate:128:16\n${files.join('\n')}`;
      fetch.mockResponse(mockResp2);
      const thumbolidator2 = new Thumbolidator('http://album.com/albums');
      await thumbolidator2.requestPromise;
      const url = thumbolidator2.thumboUrl(`DSC${16 * 16 + 1}.JPG`);
      const parsed = URL.parse(url);
      expect(parsed.host).toBeTruthy();
      expect(url).toMatch(/.thumbolidate.1.jpg$/);
    });
  });

  describe('thumboCss', () => {
    it('should return css object', async () => {
      await thumbolidator.requestPromise;
      const size = 64;
      const css = thumbolidator.thumboCss({ size, filename: 'DSC00006.JPG' });
      const { tileSize, gridSize } = thumbolidator.data;
      // thumbSize(tileSize * gridSize) : tileSize = width : size;
      const width = size * gridSize;
      expect(css).toMatchObject({
        position: 'absolute',
        width,
        height: width,
        left: expect.any(Number),
        top: expect.any(Number),
      });
    });
    it('should return css object for next page', async () => {
      const files = [...Array(16 * 16 + 3).keys()].map(k => ` DSC${k}.JPG`);
      const mockResp2 = `#thumbolidate:128:16\n${files.join('\n')}`;
      fetch.mockResponse(mockResp2);
      const thumbolidator2 = new Thumbolidator('http://album.com/albums');
      await thumbolidator2.requestPromise;
      const size = 64;
      const css = thumbolidator2.thumboCss({ size, filename: `DSC${16 * 16 + 2}.JPG` });
      const { tileSize, gridSize } = thumbolidator2.data;
      const width = size * gridSize;
      expect(css.left).toBeGreaterThan(-width);
      expect(css.top).toBeGreaterThan(-width);
    });
  });
});
