import { healthContract } from '@zcorp/wheelz-contracts';

import { server } from '../server.js';

export const healthRouter = server.router(healthContract, {
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
