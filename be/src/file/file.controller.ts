import { Controller, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('uploads')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(@Query('fileName') fileName: string) {
    return { url: await this.fileService.getPresignedUploadUrl(fileName) };
  }
}
