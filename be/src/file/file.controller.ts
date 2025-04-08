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

  // NOTE: without authentication any data is accessible given email has a record
  @Get('records')
  @HttpCode(HttpStatus.OK)
  async getRecords(@Query('ownerEmail') ownerEmail: string) {
    return this.fileService.getRecords(ownerEmail);
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

  @Get('accept')
  @HttpCode(HttpStatus.OK)
  async acceptFileInvite(
    @Query('pathId') pathId,
    @Query('token') token: string,
  ) {
    return this.fileService.accept(pathId, token);
  }
}
