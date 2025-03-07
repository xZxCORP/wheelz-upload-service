import { uploadContract } from '@zcorp/wheelz-contracts';

import { server } from '../server.js';

export const healthRouter = server.router(uploadContract.health, {
  health: async () => {
    return {
      status: 200,
      body: {
        services: [
          {
            name: 'upload',
            status: 'healthy',
          },
        ],
        status: 'healthy',
      },
    };
  },
});
