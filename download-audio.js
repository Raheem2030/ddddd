import fs from 'fs';
import https from 'https';
import path from 'path';

const url = 'https://archive.org/download/kooosa/kooosa.mp3';
const dest = path.resolve('public/kosa.mp3');

https.get(url, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, (res2) => {
      res2.pipe(fs.createWriteStream(dest));
    });
  } else {
    res.pipe(fs.createWriteStream(dest));
  }
});
