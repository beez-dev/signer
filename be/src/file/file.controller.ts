import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('uploads')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(@Query('fileName') fileName: string) {
    return this.fileService.getPresignedUploadUrl(fileName);
  }

  @Get('addone')
  @HttpCode(HttpStatus.OK)
  async addRecord() {
    return {
      statusCode: 200,
      databases: 2,
    };
  }
}
