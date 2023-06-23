import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as MongoGridFS from 'mongo-gridfs';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { File } from 'src/models/file.model';
import { Model } from 'mongoose';
import * as fs from 'fs';

async function init() {
  let mongoConnection = await mongoose.connect('mongodb://localhost:27017/Files');
  let gridFS = new MongoGridFS.MongoGridFS(mongoConnection.connection.db, 'files');
  return gridFS;
}

const gridFS = init();

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

  async deleteFile(id) {
    return await (await gridFS).delete(id);
  }
}
