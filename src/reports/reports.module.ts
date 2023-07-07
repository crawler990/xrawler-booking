import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BookingsModule } from 'src/bookings/bookings.module';


@Module({
  imports: [BookingsModule],
  controllers: [ReportsController],
  providers: [ ReportsService]
})
export class ReportsModule {}
