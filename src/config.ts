import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env' });

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default('db'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USERNAME: z.string().default('wheelz'),
  DB_PASSWORD: z.string().default('root'),
  DB_NAME: z.string().default('x_service_db'),
  AUTH_SERVICE_URL: z.string().default('http://auth_api:4010'),
  MINIO_USERNAME: z.string().default('wheelz'),
  MINIO_PASSWORD: z.string().default('12345678'),
  MINIO_HOST: z.string().default('minio'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_BUCKET_NAME: z.string().default('wheelz-upload'),
});

const parsedConfig = configSchema.safeParse(process.env);
if (!parsedConfig.success) {
  throw new Error('Invalid configuration');
}

export const config = parsedConfig.data;
export type Config = z.infer<typeof configSchema>;
