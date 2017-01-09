'use strict';

const cp = require('child_process');

let ava;
cp.spawn('tsc', ['-w'], { shell: true })
  .stdout.on('data', (data) => {
    if (!ava) {
      ava = cp.spawn('ava', ['-w'], {
        stdio: 'inherit',
        shell: true
      })
    }
    const text = data.toString()
    process.stdout.write(text)
    if (/.*Compilation complete/.test(text)) {
      let lint = cp.spawnSync('npm', ['run', 'lint'], {
        stdio: 'inherit',
        shell: true
      })
      if (lint.status === 0) {
        cp.spawnSync('npm', ['run', 'build-commonjs'])
      }
    }
  })
