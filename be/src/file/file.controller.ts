import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('uploads')
  @HttpCode(HttpStatus.OK)
  async getPresignedUploadUrl(@Query('fileName') fileName: string) {
    return this.fileService.getPresignedUploadUrl(fileName);
  }

  @Get('downloads')
  @HttpCode(HttpStatus.OK)
  async getPresignedDownloadUrl(
    @Query('pathId') pathId,
    @Query('fileName') fileName: string,
  ) {
    return this.fileService.getPresignedDownloadUrl(pathId, fileName);
  }

  @Post('records')
  @HttpCode(HttpStatus.OK)
  async addRecord(
    @Body()
    body: {
      ownerEmail: string;
      invites: string[];
      pathId: string;
      fileName: string;
    },
  ) {
    const { ownerEmail, invites, pathId, fileName } = body;
    return this.fileService.addRecord(ownerEmail, invites, pathId, fileName);
  }
}
