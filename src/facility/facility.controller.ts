import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { GetUser } from 'src/common/user.decorator';
import { Facility } from 'src/models/facility,model';
import { FacilityService } from './facility.service';

@Controller('facilities')
export class FacilityController {
    constructor(private facilityService: FacilityService){}

    @Post()
    async createFacility(@Body() facility : Facility, @GetUser()userId: ObjectId){
        delete facility._id
        return await this.facilityService.createFacility(facility, userId);
    }
    
    @Get('user')
    async getUserFacilities(@GetUser()userId: ObjectId){
        return await this.facilityService.getUserFacilities(userId)
    }

    @Get(':id')
    async getFacility(@Param('id') facilityId ){
        return await this.facilityService.getFacility(facilityId);
    }

    @Get()
    async getAllFacilities(){
        return await this.facilityService.getAllFacilities();
    }

    @Post(':id')
    async updateFacility(@Param('id') facilityId, @Body() update: Partial<Facility> ){
        return await this.facilityService.updateFacility(facilityId, update);
    }

    @Delete(':id')
    async deleteFacility(@Param('id') facilityId ){
        return await this.facilityService.deleteFacility(facilityId);
    }

}
