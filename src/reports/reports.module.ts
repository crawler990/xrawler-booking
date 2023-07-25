import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BookingsModule } from 'src/bookings/bookings.module';
import { PaymentModule } from 'src/payment/payment.module';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [BookingsModule, PaymentModule, UserModule],
  controllers: [ReportsController],
  providers: [ ReportsService]
})
export class ReportsModule {}
