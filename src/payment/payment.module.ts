import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MPESA, mpesaSchema } from "../models/mpesa.model";
import { MPESAController } from "./mpesa/mpesa.controller";
import { MPESAService } from "./mpesa/mpesa.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: MPESA.name, schema: mpesaSchema }])],
  controllers: [MPESAController],
  providers: [MPESAService],
  exports: [MPESAService]
})
export class PaymentModule {}
