import { Body, Controller, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './files.service';
import { GetUser } from 'src/common/user.decorator';

@Controller()
export class FileController {
  constructor(private fileservice: FileService) {}

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(@UploadedFiles()files, @Body()body) {
    console.log(files)
    console.log(body.parentId)
    return await this.fileservice.uploadFiles(files, body.parentId)
  }
  
  @Get('getfile/:id')
  async getfile(@Param('id') id, @Res() res: Response) {
    return await this.fileservice.getFile(id, res);
  }

  @Get('getfiles/:parentId')
  async getFiles(@Param('parentId') parentId) {
    return await this.fileservice.getFiles(parentId);
  }

  @Get('profilephoto')
  async getProfilePhoto(@GetUser()userId ) {
    return await this.fileservice.getProfilePhoto(userId)
  }

}
