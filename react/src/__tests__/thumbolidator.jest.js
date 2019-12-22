import Thumbolidator from '../thumbolidator';

const mockResp = `#thumbolidate:128:16
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
    thumbolidator = new Thumbolidator('http://album.com/albums');
  });

  describe('constructor', () => {
    it('should raise error if no arguments', () => {
      expect(() => new Thumbolidator()).toThrow('albumUrl');
    });
    it('should return instance', () => {
      expect(thumbolidator).toBeInstanceOf(Thumbolidator);
      expect(thumbolidator).toMatchObject({
        url: expect.any(String),
        dirname: expect.any(String),
        thumboUrl: expect.any(String),
        microUrl: expect.any(String),
        data: expect.anything(),
        files: expect.anything(),
        map: expect.anything(),
      });
    });
  });

  describe('thumboCss', () => {
    beforeEach(() => {
      //
    });
    it('should return css object', () => {
      const size = 64;
      const css = thumbolidator.thumboCss({ size, filename: 'DSC00006.JPG' });
      console.log(css, thumbolidator.data);
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
  });
});
