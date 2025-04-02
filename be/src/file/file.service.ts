import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {
  private client: S3Client; // not implementing DI for simplicity

  constructor() {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey!,
        secretAccessKey: config.secretKey!,
      },
    });
  }

  getPresignedUploadUrl(filename: string) {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: filename,
      }),
      {
        expiresIn: 240,
      },
    );
  }
}
