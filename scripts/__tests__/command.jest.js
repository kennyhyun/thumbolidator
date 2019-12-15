import fs from 'fs';

const fsp = fs.promises;
const tmpdir = '/tmp/thumbolidate.command';

describe('thumbolidator', () => {
  const org = process.exit;
  let mock;
  beforeEach(() => {
    jest.resetModules();
    mock = jest.fn();
    process.exit = mock;
    return fsp.mkdir(tmpdir);
  });
  afterEach(() => {
    jest.resetModules();
    process.exit = org;
    return fsp.rmdir(tmpdir, { recursive: true });
  });

  it('should return error if no arguments passed', async () => {
    process.argc = 2;
    process.argv = ['a', 'b'];
    await import('../command.js').catch(e => {});
    const dir = await fsp.readdir(tmpdir);
    expect(mock).toBeCalledWith(-1);
  });

});
