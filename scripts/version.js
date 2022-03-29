const path = require('path');
const fs = require('fs');
const sfVersion = require('../projects/sf-portal/package.json').version;
const uiVersion = require('../projects/sf-portal/node_modules/@epgu/ui/package.json').version;
const cfDirInnerVersion = '../projects/sf-portal/node_modules/@epgu/epgu-constructor/package.json';
const cfDirRootVersion = '../node_modules/@epgu/epgu-constructor/package.json';
let cfVersion = '';


if (fs.existsSync(cfDirInnerVersion)) {
  cfVersion = require(cfDirInnerVersion).version
} else {
  cfVersion = require(cfDirRootVersion).version
}

const versionFileLibPath = path.join(
  __dirname,
  '..',
  'dist',
  'sf-portal',
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
    console.error('epgu2: generate version file is FAIL - ', err);
    throw err;
  } else {
    console.log('epgu2: generate version file is SUCCESS');
    console.log(`sfPortalVersion: ${sfVersion}, formPlayerVersion: ${cfVersion}, epguLibVersion: ${uiVersion}`);
  }
}
