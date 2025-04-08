import { Injectable } from '@nestjs/common';

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import config from '../config';
import { FileService } from '../file/file.service';
import { hash } from '../util/crypto';

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

  async sendInvites(
    ownerEmail: string,
    emails: string[],
    pathId: string,
    fileName: string,
  ) {
    const data = await this.fileService.getPresignedDownloadUrl(
      pathId,
      fileName,
    );

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
                    Please click on the link to view the document: ${data.url}. \n
                    Please click the link to accept it: ${config.baseUrl}/accept?pathId=${pathId}&fileName=${fileName}&token=${hash(eachEmail)}`, // Accepting: Basic form of signing

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
