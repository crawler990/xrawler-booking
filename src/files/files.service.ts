import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { File } from 'src/models/file.model';
import { Model } from 'mongoose';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel : Model <File>
  ) {}

  async uploadFile(file, parentId){
    return await new this.fileModel({name: file.originalname, data: file.buffer, contentType: file.mimetype, parentId}).save()
  }

  async getFile(id: string, res: Response) {
    const file = await this.fileModel.findById(id);
    const fileData = file.data;
 
    res.set('Content-Type', file.contentType);
    res.send(fileData);
  }

  async getFiles(parentId, res: Response) {
    const files = await this.fileModel.find({parentId});
    let data = [];
    for (const file of files) {
      data.push(file.data)
    }
  }

}
