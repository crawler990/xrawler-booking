import { Module } from '@nestjs/common';
import { FileController } from './files.controller';
import { FileService } from './files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, fileSchema } from 'src/models/file.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: File.name, schema: fileSchema}])
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FilesModule {}
