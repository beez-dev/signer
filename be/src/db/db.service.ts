import { Db, MongoClient } from 'mongodb';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import config from '../config';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    static readonly dbName = 'signer';
    readonly db: Db;
    private readonly client: MongoClient;

    constructor() {
        this.client = new MongoClient(config.dbConnectionString);
        this.db = this.client.db(DbService.dbName);
    }

    async onModuleInit() {
        try {
            await this.client.connect();
            console.log('✅ Successfully connected to DocumentDB');

            // Test the connection
            await this.db.admin().ping();
            console.log('✅ Database ping successful');
        } catch (error) {
            console.error('❌ Failed to connect to DocumentDB:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.client.close();
            console.log('✅ Database connection closed');
        } catch (error) {
            console.error('❌ Error closing database connection:', error);
        }
    }
}
