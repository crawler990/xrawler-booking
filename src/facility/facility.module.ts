import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { Facility, facilitySchema } from 'src/models/facility,model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Facility.name, schema: facilitySchema}
    ])
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService]
})
export class FacilityModule {}
