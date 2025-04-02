import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [FileModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
