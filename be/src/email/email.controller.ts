import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  async sendEmailInvite(
    @Body('emails') emails: string,
    @Body('filename') filename: string,
    @Body('id') id: string,
  ) {
    return this.emailService.sendInvites(emails, filename, id);
  }
}
