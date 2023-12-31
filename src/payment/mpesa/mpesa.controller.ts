import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { DTOMPESA } from '../../models/mpesa.model';
import { MPESAService } from './mpesa.service';

@Controller('mpesa')
export class MPESAController {
  constructor(private mpesaservice: MPESAService) {}

  @Post('processrequest')
  async makePayment(@Body() body: DTOMPESA) {
    console.log(body)
    console.log('hit')
    if(!body.phoneNumber || !body.amount) throw new HttpException('Please provide the phone number and amount to be processed', HttpStatus.BAD_REQUEST);
    return await this.mpesaservice.processRequest(body);
  }

  @Post('callback')
  async getCallBack(@Req() req: Request) {
    console.log('callback')
    console.log(req.body.Body.stkCallback);
    let update = req.body.Body.stkCallback;
    await this.mpesaservice.updateTransaction(update);
  }

  @Post('reversal')
  async reversal(@Body() body) {
    return await this.mpesaservice.reversePayment(body.transactionID);
  }

  @Post('status')
  async status(@Body() body) {
    return await this.mpesaservice.getStatus(body.transactionID);
  }

  @Post('balance')
  async balance() {
    return await this.mpesaservice.getAccountBalance();
  }

  @Post('queueTimeOut')
  async queueTimeOut(@Req() req: Request) {
    console.log('Queue Timeout');
    console.log(req);
  }

  @Post('result')
  async result(@Req() req: Request) {
    console.log('Result')
    console.log(req.body)
  }

  @Get('gettransaction/:id')
  async getTransaction(@Param('id')id){
    return await this.mpesaservice.getTransaction(id)
  }
}
