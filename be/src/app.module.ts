import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { EmailModule } from './email/email.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [FileModule, EmailModule, DbModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
