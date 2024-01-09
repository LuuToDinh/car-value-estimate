// Run this file before run all the test
import { rm } from 'fs/promises';
import { join } from 'path';

// Global beforeEach: detele test db (wipe) before making a new test
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (err) {}
});
