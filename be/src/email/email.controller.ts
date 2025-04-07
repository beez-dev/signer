import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('invite')
  @HttpCode(HttpStatus.OK)
  async sendEmailInvite(
    @Body()
    body: {
      ownerEmail: string;
      emails: string[];
      pathId: string;
      fileName: string;
    },
  ) {
    const { ownerEmail, emails, pathId, fileName } = body;
    return this.emailService.sendInvites(ownerEmail, emails, pathId, fileName);
  }
}
