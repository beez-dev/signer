import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import config from '../config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateRandomString } from '../util/random';
import { DbService } from '../db/db.service';

@Injectable()
export class FileService {
  private client: S3Client; // not implementing DI for simplicity

  constructor(private dbService: DbService) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey!,
        secretAccessKey: config.secretKey!,
      },
    });
  }

  async getPresignedUploadUrl(filename: string) {
    const pathId = generateRandomString();

    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: `${pathId}/${filename}`,
      }),
      {
        expiresIn: 240,
      },
    );

    return { url, pathId };
  }

  async getPresignedDownloadUrl(pathId: string, fileName: string) {
    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: config.bucketName,
        Key: `${pathId}/${fileName}`,
      }),
      {
        expiresIn: 600000,
      },
    );

    return { url, pathId, fileName };
  }

  async addRecord(ownerEmail: string, pathId: string, fileName: string) {
    return this.dbService.db
      .collection('uploads')
      .insertOne({ [`${ownerEmail}-${pathId}`]: `${pathId}/${fileName}` });
  }
}
