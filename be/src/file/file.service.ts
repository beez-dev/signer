import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateRandomString } from '../util/random';

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

  async getPresignedUploadUrl(filename: string) {
    const id = generateRandomString();

    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: `${id}/${filename}`,
      }),
      {
        expiresIn: 240,
      },
    );

    return { url, id };
  }
}
