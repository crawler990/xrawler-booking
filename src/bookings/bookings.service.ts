import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Booking } from 'src/models/booking.model';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel : Model<Booking>
    ){}

    async createBooking(booking: Booking, userId: ObjectId){
        booking.by = userId;
        return await new this.bookingModel(booking).save();
    }

    async getBooking(bookingId : ObjectId){
        let booking = await this.bookingModel.findById(bookingId).populate('by', 'username -_id').populate('facility', 'name -_id');
        if(!booking) throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
        else return booking;
    }

    async getUserBookings(userId: ObjectId){
        return await this.bookingModel.find({by: userId}).populate('by', 'username -_id').populate('facility', 'name -_id');
    }

    async getAllBookings(){
        return await this.bookingModel.find();
    }

    async getFacilityBookings(facilityId){
        return await this.bookingModel.find({facility: facilityId}).populate('by', 'username -_id').populate('facility', 'name -_id');
    }

    async updateBooking(bookingId: ObjectId, update: Partial<Booking>){
        return await this.bookingModel.findByIdAndUpdate(bookingId, update, {new: true})
    }

    async deleteBooking( bookingId: ObjectId){
        return await this.bookingModel.findByIdAndDelete(bookingId);
    }
}

