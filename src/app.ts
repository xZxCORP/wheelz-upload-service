import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { authPlugin } from '@zcorp/shared-fastify';
import { uploadContract } from '@zcorp/wheelz-contracts';
import Fastify from 'fastify';

import { config } from './config.js';
import { openApiDocument } from './open-api.js';
import { healthRouter } from './routes/health.js';
import { uploadRouter } from './routes/upload.js';
import { server } from './server.js';
export const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

app.setErrorHandler((error, _, reply) => {
  reply.status(error.statusCode ?? 500).send({ message: error.message, data: error.cause });
});
app.register(cors, {
  origin: '*',
});

app.register(authPlugin, {
  authServiceUrl: config.AUTH_SERVICE_URL,
});
app.register(fastifyMultipart, {
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
server.registerRouter(uploadContract.health, healthRouter, app, {
  requestValidationErrorHandler(error, request, reply) {
    return reply.status(400).send({ message: 'Validation failed', data: error.body?.issues });
  },
});
server.registerRouter(uploadContract.upload, uploadRouter, app, {
  requestValidationErrorHandler(error, request, reply) {
    return reply.status(400).send({ message: 'Validation failed', data: error.body?.issues });
  },
});

app
  .register(fastifySwagger, {
    transformObject: () => ({
      ...openApiDocument,
      security: [{ BearerAuth: [] }],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    }),
  })
  .register(fastifySwaggerUI, {
    routePrefix: '/ui',

    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
    },
  });
