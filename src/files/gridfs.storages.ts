import * as crypto from 'crypto';
import * as multer from 'multer';
import * as GridFsStorage from 'multer-gridfs-storage';
import * as path from 'path';

export const storage = new GridFsStorage.GridFsStorage({
  url: 'mongodb://localhost:27017/Files',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'files',
        };
        resolve(fileInfo);
      });
    });
  },
});

export const upload = multer({ storage: storage });
