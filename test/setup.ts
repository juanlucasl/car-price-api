import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    /* Don't crash if the file isn't found (i.e. when the tests are executed for
     * the first time)
     */
  }
});
