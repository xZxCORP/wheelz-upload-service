import { requireAuth } from '@zcorp/shared-fastify';
import { uploadContract } from '@zcorp/wheelz-contracts';

import { config } from '../config.js';
import { MinioClient } from '../infrastructure/minio/client.js';
import { server } from '../server.js';
const minioClient = new MinioClient(config);
await minioClient.init();

export const uploadRouter = server.router(uploadContract.upload, {
  uploadFile: {
    hooks: {
      onRequest: [requireAuth()],
    },
    handler: async (input) => {
      const file = await input.request.file();
      if (!file) {
        return {
          status: 400,
          body: {
            message: 'No file uploaded',
          },
        };
      }
      const url = await minioClient.uploadFile(file);
      if (!url) {
        return {
          status: 400,
          body: {
            message: 'File upload failed',
          },
        };
      }
      return {
        status: 201,
        body: {
          url,
        },
      };
    },
  },

  deleteFile: {
    hooks: {
      onRequest: [requireAuth()],
    },
    handler: async (input) => {
      const url = input.body.url;
      const parsedUrl = new URL(url);
      const fileName = parsedUrl.pathname.split('/').pop();
      if (!fileName) {
        return {
          status: 400,
          body: {
            message: 'Invalid file name',
          },
        };
      }
      await minioClient.deleteFile(fileName);
      return {
        status: 200,
        body: {
          message: 'File deleted',
        },
      };
    },
  },
});
