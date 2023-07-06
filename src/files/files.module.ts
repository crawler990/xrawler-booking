import { Module } from '@nestjs/common';
import { FileController } from './files.controller';
import { FileService } from './files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, fileSchema } from 'src/models/file.model';
import { FacilityModule } from 'src/facility/facility.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: File.name, schema: fileSchema}]),
    FacilityModule
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
