import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { FacilityService } from 'src/facility/facility.service';
import { File } from 'src/models/file.model';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel : Model <File>,
    private facilityService: FacilityService
  ) {}

  async uploadFiles(files, parentId){
    for (const file of files) {
      await new this.fileModel({name: file.originalname, data: file.buffer, contentType: file.mimetype, parentId}).save()
    }
  }

  async getFile(id: string, res: Response) {
    const file = await this.fileModel.findById(id);
    const fileData = file.data;
 
    res.set('Content-Type', file.contentType);
    res.send(fileData);
  }

  async getFiles(parentId) {
    return await this.fileModel.find({parentId});
  }

  async getProfilePhoto(parentId) {
    return await this.fileModel.findOne({parentId})
  }

}
