import { exec } from '../thumb';

describe('exec', () => {
  it('should run ls and print the result', async () => {
    await expect(exec('ls')).resolves.toBe(0);
  });
  it('should print error', async () => {
    await expect(exec('chmod', ['+x', '/']))
      .resolves.toBe(1);
  });
  it('should be rejected', async () => {
    await expect(exec('_mkdir'))
      .rejects.toThrow('NOENT');
  });
});
