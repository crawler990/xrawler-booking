import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from './files.service';
import { upload } from './gridfs.storages';

@Controller()
export class FileController {
  constructor(private fileservice: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile()file,  @Body()body, @Request() req) {
    console.log(file);
    console.log(body.parentId);
    // console.log(req);
    await this.fileservice.uploadFile(file, body.parentId)
    // return `File uploaded successfuly : ${file.originalname}`;
  }

  @Post('uploadmultiple')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles() {}

  
  @Get('getfile/:id')
  async getfile(@Param('id') id, @Res() res: Response) {
    return await this.fileservice.getFile(id, res);
  }

  @Get('getfiles/:parentId')
  async getFiles(@Param('parentId') parentId, @Res() res: Response) {
    return await this.fileservice.getFiles(parentId, res);
  }

  @Put('updatefile/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@Param('id') id, @UploadedFile() updatefile) {
    await this.fileservice.deleteFile(id);
    updatefile._id = id;
    upload.single('file');
    return updatefile;
  }

  @Delete('deletefile/:id')
  deleteFile(@Param('id') id) {
    return this.fileservice.deleteFile(id);
  }
}
