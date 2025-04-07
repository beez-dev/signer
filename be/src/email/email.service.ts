import { Injectable } from '@nestjs/common';

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import config from '../config';
import { FileService } from '../file/file.service';

@Injectable()
export class EmailService {
  private client: SESClient;

  constructor(private fileService: FileService) {
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey!,
        secretAccessKey: config.secretKey!,
      },
    });
  }

  sendInvites(
    ownerEmail: string,
    emails: string[],
    pathId: string,
    fileName: string,
  ) {
    for (const eachEmail of emails) {
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
              Data: `Signer:\n
                    You have been invited to sign ${fileName} by : ${ownerEmail}.\n
                    Please click on the link to view the document: ___. \n
                    Please click the link to accept it: ${config.baseUrl}?pathId=${pathId}&fileName=${fileName}`, // Accepting: Basic form of signing

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
