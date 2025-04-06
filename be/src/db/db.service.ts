import { Db, MongoClient } from 'mongodb';
import { Injectable } from '@nestjs/common';
import config from '../config';

@Injectable()
export class DbService {
  static readonly dbName = 'signer';
  readonly db: Db;
  private readonly client: MongoClient;

  constructor() {
    this.client = new MongoClient(config.dbConnectionString);
    this.db = this.client.db(DbService.dbName);
  }
}
