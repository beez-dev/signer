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
import { hash } from '../util/crypto';

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

  async getRecords(ownerEmail: string) {
    return this.dbService.db
      .collection('records')
      .find(
        {
          ownerEmail,
        },
        { projection: { fileName: 1, status: 1, _id: 0 } },
      )
      .toArray();
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

  async addRecord(
    ownerEmail: string,
    invites: string[],
    pathId: string,
    fileName: string,
  ) {
    const data = await this.dbService.db
      .collection('records')
      .findOne({ pathId });

    if (data) {
      throw Error('Record already exists');
    }

    const inviteStatus = invites.reduce((acc, mail) => {
      return { ...acc, [hash(mail)]: 'pending' };
    }, {});

    return this.dbService.db.collection('records').insertOne({
      pathId,
      fileName,
      ownerEmail,
      invites,
      status: inviteStatus,
    });
  }

  async accept(pathId: string, token: string) {
    const record = await this.dbService.db.collection('records').findOne({
      pathId,
      [`status.${token}`]: 'pending',
    });

    if (!record) {
      throw Error('Record not found.');
    }

    return this.dbService.db.collection('records').updateOne(
      {
        pathId,
        [`status.${token}`]: 'pending',
      },
      {
        $set: {
          [`status.${token}`]: 'accepted',
        },
      },
    );
  }
}
