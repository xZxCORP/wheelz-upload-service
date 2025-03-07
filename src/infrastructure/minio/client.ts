import { randomUUID } from 'node:crypto';

import type { MultipartFile } from '@fastify/multipart';
import * as Minio from 'minio';

import type { Config } from '../../config.js';

export class MinioClient {
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
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.config.MINIO_BUCKET_NAME}/*`],
        },
      ],
    };
    await this.client.setBucketPolicy(this.config.MINIO_BUCKET_NAME, JSON.stringify(policy));
    console.log('Minio service initialized');
  }
  async uploadFile(file: MultipartFile): Promise<string | null> {
    const fileName = this._generateFileName(file);
    const fileBuffer = await file.toBuffer();
    try {
      await this.client.putObject(
        this.config.MINIO_BUCKET_NAME,
        fileName,
        fileBuffer,
        fileBuffer.length
      );
      return `${this.config.MINIO_PUBLIC_HOST}:${this.config.MINIO_PORT}/${this.config.MINIO_BUCKET_NAME}/${fileName}`;
    } catch {
      return null;
    }
  }
  async deleteFile(fileName: string) {
    try {
      await this.client.removeObject(this.config.MINIO_BUCKET_NAME, fileName);
      return true;
    } catch {
      return false;
    }
  }
  private _generateFileName(file: MultipartFile) {
    const fileName = file.filename ?? randomUUID().toString();
    return `${Date.now()}-${fileName}`;
  }
}
