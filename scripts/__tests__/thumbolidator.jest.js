import fs from 'fs';
import thumbolidator from '../thumbolidator';

const fsp = fs.promises;
const tmpdir = '/tmp/thumbolidate.0';

describe('thumbolidator', () => {
  const org = process.exit;
  let mock;
  beforeEach(async () => {
    jest.resetModules();
    mock = jest.fn();
    process.exit = mock;
    return fsp.mkdir(tmpdir);
  });
  afterEach(async () => {
    jest.resetModules();
    process.exit = org;
    return fsp.rmdir(tmpdir, { recursive: true });
  });

  it('should put .thumbolidate recursively', async () => {
    const subdir1 = `${tmpdir}/2011-11-11`;
    const subdir2 = `${tmpdir}/2012-12-12`;
    await fsp.mkdir(subdir1);
    await fsp.mkdir(subdir2);
    await thumbolidator(tmpdir, { recursive: true });
    await new Promise(res => setTimeout(res, 1000));
    const outDirFiles = await fsp.readdir(subdir1);
    expect(outDirFiles).toContain('.thumbolidate');
  });

});
