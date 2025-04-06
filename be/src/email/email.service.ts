import { Injectable } from '@nestjs/common';

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import config from '../config';

@Injectable()
export class EmailService {
  private client: SESClient;

  constructor() {
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey!,
        secretAccessKey: config.secretKey!,
      },
    });
  }

  sendInvites(to: string, filename: string, id: string) {
    const allEmails = to.split(',');

    for (const eachEmail of allEmails) {
      const input = {
        Source: config.adminEmail,
        ReplyToAddresses: [],
        Destination: {
          ToAddresses: [eachEmail],
        },
        Message: {
          Subject: {
            Data: 'Document signature invite', // required
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: 'STRING_VALUE',
              Charset: 'UTF-8',
            },
          },
        },
      };

      // could be optimized
      const command = new SendEmailCommand(input);
      return this.client.send(command);
    }
  }
}
