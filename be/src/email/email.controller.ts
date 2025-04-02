import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Get('invite')
    @HttpCode(HttpStatus.OK)
    async sendEmailInvite() {
        return this.emailService.sendEmail('');
    }
}
