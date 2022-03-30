const path = require('path');
const fs = require('fs');
const sfPackage = require('../projects/sf-portal/package.json');
const sfVersion = sfPackage.version;
const cfVersion = sfPackage.dependencies['@epgu/epgu-constructor'];
const uiVersion = sfPackage.dependencies['@epgu/ui'];


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
