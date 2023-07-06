import { HttpException, HttpStatus, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Facility } from 'src/models/facility,model';


@Injectable()
export class FacilityService {
    constructor(
        @InjectModel(Facility.name) private facilityModel : Model<Facility>
    ){}

    async createFacility(facility: Facility, userId: ObjectId){
        facility.owner = userId;
        return await new this.facilityModel(facility).save();
    }

    async getFacility(facilityId : ObjectId){
        let facility = await this.facilityModel.findById(facilityId).populate('owner', 'username');
        if(!facility) throw new HttpException('Facility not found', HttpStatus.NOT_FOUND);
        else return facility;
    }

    async getUserFacilities(userId: ObjectId){
        return await this.facilityModel.find({owner: userId}).sort({createdAt: -1}).populate('owner', 'username')
    }

    async getAllFacilities(){
        return await this.facilityModel.find().sort({name: 1});
    }

    async updateFacility(facilityId: ObjectId, update: Partial<Facility>){
        return await this.facilityModel.findByIdAndUpdate(facilityId, update, {new: true})
    }

    async deleteFacility( facilityId: ObjectId){
        return await this.facilityModel.findByIdAndDelete(facilityId);
    }
}
