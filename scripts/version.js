const path = require('path');
const fs = require('fs');
const sfVersion = require('../projects/sf-portal/package.json').version;
const cfVersion = require('../projects/epgu-constructor/package.json').version;
const uiVersion = require('@epgu/ui/package.json').version;
const versionFileLibPath = path.join(
  __dirname,
  '..',
  'dist',
  'epgu-constructor',
  'src',
  'assets',
  'version.json',
);
const src = `{ "sfPortalVersion": "${sfVersion}", "formPlayerVersion": "${cfVersion}", "epguLibVersion": "${uiVersion}" }`;

fileWrite();

// <--- tools

function fileWrite() {
  // ensure version module pulls value from package.json
  fs.writeFile(versionFileLibPath, src, { flat: 'w' }, fileWriteCallBack);
}

function fileWriteCallBack(err) {
  if (err) {
    console.error('epguc: generate file with lib version is FAIL - ', err);
    throw err;
  } else {
    console.log(`epguc: generate file lib version ${cfVersion} is SUCCESS`);
  }
}
