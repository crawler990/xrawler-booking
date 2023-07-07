import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, bookingSchema } from 'src/models/booking.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Booking.name, schema: bookingSchema}])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService]
})
export class BookingsModule {}
