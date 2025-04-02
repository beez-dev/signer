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

  sendEmail(to: string) {
    const input = {
      Source: config.adminEmail,
      ReplyToAddresses: [],
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: 'STRING_VALUE', // required
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

    console.log({ input: JSON.stringify(input) });
    const command = new SendEmailCommand(input);
    return this.client.send(command);
  }
}
