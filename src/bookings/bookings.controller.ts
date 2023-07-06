import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { GetUser } from 'src/common/user.decorator';
import { Booking } from 'src/models/booking.model';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService){}

    @Post()
    async createBooking(@Body() booking : Booking, @GetUser()userId: ObjectId){
        console.log('booking', booking)
        delete booking._id
        return await this.bookingsService.createBooking(booking, userId);
    }
    
    @Get('user')
    async getUserBookings(@GetUser()userId: ObjectId){
        return await this.bookingsService.getUserBookings(userId)
    }

    @Get(':id')
    async getBooking(@Param('id') bookingId ){
        return await this.bookingsService.getBooking(bookingId);
    }

    @Get('facility/:id')
    async getFacilityBookings(@Param('id')facilityId){
        return await this.bookingsService.getFacilityBookings(facilityId);
    }

    @Get()
    async getAllBookings(){
        return await this.bookingsService.getAllBookings();
    }

    @Post('update/:id')
    async updateBooking(@Param('id') bookingId, @Body() update: Partial<Booking> ){
        return await this.bookingsService.updateBooking(bookingId, update);
    }

    @Delete(':id')
    async deletebooking(@Param('id') bookingId ){
        return await this.bookingsService.deleteBooking(bookingId);
    }

}
