const path = require('path');
const fs = require('fs');
const libVersion = require('../projects/epgu-constructor/package.json').version;
const versionFilePath = path.join(__dirname, '..', 'projects', 'epgu-constructor', 'src', 'assets', 'version.json');
const src = `{ "formPlayerVersion": "${libVersion}" }`;

fileWrite();


// <--- tools

function fileWrite() {
  // ensure version module pulls value from package.json
  fs.writeFile(versionFilePath, src, { flat: 'w' }, fileWriteCallBack);
}

function fileWriteCallBack(err) {
  if (err) {
    console.error('epguc: generate file with lib version is FAIL - ', err);
    throw err;
  } else {
    console.log(`epguc: generate file lib version ${libVersion} is SUCCESS`);
  }
}
