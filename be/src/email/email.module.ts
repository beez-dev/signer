import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
