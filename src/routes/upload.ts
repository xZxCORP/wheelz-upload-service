import { uploadContract } from '@zcorp/wheelz-contracts';

import { config } from '../config.js';
import { server } from '../server.js';
import { MinioService } from '../services/minio.js';
const minioService = new MinioService(config);
await minioService.init();
export const uploadRouter = server.router(uploadContract.upload, {
  uploadFile: async (input) => {
    const file = await input.request.file();
  },
  deleteFile: async (input) => {
    return {
      status: 200,
      body: {
        message: 'File deleted',
      },
    };
  },
});
