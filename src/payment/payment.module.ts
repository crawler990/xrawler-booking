import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MPESAController } from "./mpesa/controllers/mpesa.controller";
import { MPESA, mpesaSchema } from "./mpesa/mpesa.model";
import { MPESAService } from "./mpesa/services/mpesa.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: MPESA.name, schema: mpesaSchema }])],
  controllers: [MPESAController],
  providers: [MPESAService],
  exports: [MPESAService]
})
export class PaymentModule {}
