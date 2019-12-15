import fs from 'fs';
import path from 'path';
import Thumbolidate from '../thumbolidate';

const fsp = fs.promises;
const tmpdir = '/tmp/thumbolidate.1';
const opt = {
  tileSize: 16,
  gridSize: 4,
  path: tmpdir,
  files: [],
  directories: [],
};

describe('thumbolidate', () => {
  const OLD_ENV = process.env;
  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
    return fsp.mkdir(tmpdir);
  });
  afterEach(async () => {
    process.env = OLD_ENV;
    return fsp.rmdir(tmpdir, { recursive: true });
  });

  it('should create .thumbolidate with meta', async () => {
    const t = new Thumbolidate(opt);
    await t.build();
    const content = (await fsp.readFile(`${tmpdir}/.thumbolidate`)).toString();
    expect(content).toContain('#thumbolidate:');
    const [, ts, gs] = content.split(':');
    expect(ts).toEqual(opt.tileSize.toString());
    expect(gs).toEqual(opt.gridSize.toString());
  });

  it('should put .thumbolidate including directories', async () => {
    const directories = ['2000-01-01', '111', '_abc'];
    const t = new Thumbolidate({
      ...opt,
      directories,
    });
    await t.build();
    const content = (await fsp.readFile(`${tmpdir}/.thumbolidate`)).toString();
    expect(content).toContain('#thumbolidate:');
    const lines = content.split('\n');
    expect(lines).toContain(`d${directories[0]}`);
  });

  it('should put .thumbolidate including jpegs', async () => {
    const files = ['a1.jpg', 'a2.jpg'];
    await Promise.all(files.map(f => fsp.copyFile(path.resolve(__dirname, 'fixtures', f), path.resolve(tmpdir, f))));
    const t = new Thumbolidate({
      ...opt,
      files,
    });
    await t.build();
    const content = (await fsp.readFile(`${tmpdir}/.thumbolidate`)).toString();
    expect(content).toContain('#thumbolidate:');
    const lines = content.split('\n');
    expect(lines).toContain(` ${files[0]}`);
    expect(lines).toContain(` ${files[1]}`);
    const outDirFiles = await fsp.readdir(tmpdir);
    expect(outDirFiles).toContain('.thumbolidate.jpg');
    expect(outDirFiles).toContain('.thumbolidate.micro.jpg');
  });

  it('should skip invalid jpegs', async () => {
    const files = ['a1.jpg', 'a2.jpg', 'broken.jpg'];
    await Promise.all(files.map(f => fsp.copyFile(path.resolve(__dirname, 'fixtures', f), path.resolve(tmpdir, f))));
    const t = new Thumbolidate({
      ...opt,
      files,
    });
    await t.build();
    const content = (await fsp.readFile(`${tmpdir}/.thumbolidate`)).toString();
    expect(content).toContain('#thumbolidate:');
    const lines = content.split('\n');
    expect(lines).toContain(` ${files[0]}`);
    expect(lines).toContain(` ${files[1]}`);
    const outDirFiles = await fsp.readdir(tmpdir);
    expect(outDirFiles).toContain('.thumbolidate.jpg');
    expect(outDirFiles).toContain('.thumbolidate.micro.jpg');
  });

  it('should generate thumb directories when GENERATE_THUMB_DIR has thumbnail size', async () => {
    process.env.GENERATE_THUMB_DIR = '128';
    const _Thumbolidate = require('../thumbolidate');
    const files = ['a1.jpg', 'a2.jpg'];
    await Promise.all(files.map(f => fsp.copyFile(path.resolve(__dirname, 'fixtures', f), path.resolve(tmpdir, f))));
    const t = new _Thumbolidate({
      ...opt,
      files,
    });
    await t.build();
    const content = (await fsp.readFile(`${tmpdir}/.thumbolidate`)).toString();
    expect(content).toContain('#thumbolidate:');
    const lines = content.split('\n');
    expect(lines).toContain(` ${files[0]}`);
    expect(lines).toContain(` ${files[1]}`);
    const outDirFiles = await fsp.readdir(tmpdir);
    expect(outDirFiles).toContain('.thumbolidate.jpg');
    expect(outDirFiles).toContain('.thumbolidate.micro.jpg');
    process.env.GENERATE_THUMB_DIR = '';
  });

});
