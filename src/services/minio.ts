import * as Minio from 'minio';

import type { Config } from '../config.js';
export class MinioService {
  client: Minio.Client;
  constructor(private readonly config: Config) {
    this.client = new Minio.Client({
      endPoint: config.MINIO_HOST,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_USERNAME,
      secretKey: config.MINIO_PASSWORD,
    });
  }
  async init() {
    const bucketExists = await this.client.bucketExists(this.config.MINIO_BUCKET_NAME);
    if (!bucketExists) {
      await this.client.makeBucket(this.config.MINIO_BUCKET_NAME);
    }
    console.log('Minio service initialized');
  }
}
