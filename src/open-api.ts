import { generateOpenApi } from '@ts-rest/open-api';
import { healthContract } from '@zcorp/wheelz-contracts';

export const openApiDocument = generateOpenApi(
  healthContract,
  {
    info: {
      title: 'Wheelz Upload Service',
      version: '1.0.0',
    },
  },
  {
    setOperationId: true,
  }
);
