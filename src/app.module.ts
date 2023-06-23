import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { FacilityModule } from './facility/facility.module';
import { FilesModule } from './files/files.module';
import { PaymentModule } from './payment/payment.module';
import { AuthenticationGuard } from './user/auth/authentication.guard';
import { UserModule } from './user/user.module';

const mongoURL = 'mongodb+srv://brian:dbpass@cluster0.lpfc8dq.mongodb.net/?retryWrites=true&w=majority'

@Module({
  imports: [MongooseModule.forRoot(mongoURL), UserModule, FacilityModule, BookingsModule, FilesModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService,
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard
  }
],
})
export class AppModule {}
