import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DTOMPESA, MPESA, TransactionType, callBackUrl, consumerKey, consumerSecret, mpesaAccessTokenUrl, mpesaBusinessShortCode, mpesaQueueTimeOutUrl, mpesaResultUrl, mpesaReversalUrl, mpesaSTKPushUrl, mpesaTransactionStatusUrl, passKey, securityCredential } from '../../models/mpesa.model';
import axios from 'axios';

var unirest = require('unirest');

@Injectable()
export class MPESAService {
  constructor(@InjectModel(MPESA.name) private mpesamodel: Model<MPESA>) {}

  async getAccessToken() {
   let auth = Buffer.from(consumerKey+":"+consumerSecret).toString('base64');
    let result = await unirest('GET', mpesaAccessTokenUrl)
        .headers({ 'Authorization': `Basic ${auth}` })
        .send();
        
    return JSON.parse(result.raw_body);
  }

  async processRequest(data: DTOMPESA) {
    const timestamp = this.getMPesaTimeStamp();

    let password = Buffer.from(mpesaBusinessShortCode + passKey + timestamp).toString('base64');
    let accessToken = (await this.getAccessToken()).access_token;

    let transaction = {
      BusinessShortCode: mpesaBusinessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: data.transactionType ? data.transactionType : TransactionType.CustomerPayBillOnline,
      // Amount: data.amount ? data.amount : 1,
      Amount: 1,
      PartyA: data.phoneNumber,
      PartyB: mpesaBusinessShortCode,
      PhoneNumber: data.phoneNumber,
      CallBackURL: callBackUrl,
      AccountReference: data.accountReference ? data.accountReference : 'XRAWLER',
      TransactionDesc: data.transactionDescription ? data.transactionDescription : 'Payment of goods/services.',
    };

    let dataToSend = JSON.stringify(transaction);

    let result = await unirest
      .post(mpesaSTKPushUrl)
      .headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      })
      .send(dataToSend);

      axios.post(mpesaSTKPushUrl, dataToSend, {headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      } }).then((response) => {
        console.log(response)
      })

      
    let resultObject = JSON.parse(result.raw_body);

    // Saving the Object to the db
    let mpesaTransaction = new this.mpesamodel();
    mpesaTransaction.businessShortCode = transaction.BusinessShortCode;
    mpesaTransaction.password = transaction.Password;
    mpesaTransaction.timeStamp = transaction.Timestamp;
    mpesaTransaction.transactionType = transaction.TransactionType;
    mpesaTransaction.amount = transaction.Amount;
    mpesaTransaction.partyA = transaction.PartyA;
    mpesaTransaction.partyB = transaction.PartyB;
    mpesaTransaction.phoneNumber = transaction.PhoneNumber;
    mpesaTransaction.callBackUrl = transaction.CallBackURL;
    mpesaTransaction.accountReference = transaction.AccountReference;
    mpesaTransaction.transactionDesc = transaction.TransactionDesc;

    //response from the mpesa api
    mpesaTransaction.merchantRequestID = resultObject.MerchantRequestID;
    mpesaTransaction.checkoutRequestID = resultObject.CheckoutRequestID;
    mpesaTransaction.responseCode = resultObject.ResponseCode;
    mpesaTransaction.responseDescription = resultObject.ResponseDescription;
    mpesaTransaction.customerMessage = resultObject.CustomerMessage;

    await mpesaTransaction.save();
    return resultObject;
  }

  async updateTransaction(update) {
    // Update transaction after receiving response from the mpesa api
    let mpesaTransaction = await this.mpesamodel.findOne({ checkoutRequestID: update.CheckoutRequestID });

    if (update.CallbackMetadata) {
      let item = update.CallbackMetadata.Item;
      for (let value of item) {
        if (value.Name === 'MpesaReceiptNumber') mpesaTransaction.mpesaReceiptNumber = value.Value;
        if (value.Name === 'TransactionDate') mpesaTransaction.transactionDate = value.Value;
      }
    }

    mpesaTransaction.resultCode = update.ResultCode;
    mpesaTransaction.resultDescription = update.ResultDesc;

    await mpesaTransaction.save();
    console.log(mpesaTransaction);
  }

  async reversePayment(transactionID: string){
    const auth = (await this.getAccessToken()).access_token;

    const transaction = {
      CommandID: 'TransactionReversal',
      // ReceiverParty: 600997,
      ReceiverParty: mpesaBusinessShortCode,
      ReceiverIdentifierType: 11,
      Remarks: 'reversal',
      Initiator: 'testapi',
      SecurityCredential: securityCredential,
      QueueTimeOutURL: mpesaQueueTimeOutUrl,
      ResultURL: mpesaResultUrl,
      TransactionID: transactionID,
      Occasion: '',
    }

    const dataToSend = JSON.stringify(transaction);

    const result = await unirest('POST', mpesaReversalUrl).
    headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`
    }).
    send(dataToSend);

    console.log(result);
  }

  async getStatus(transactionID: string){
    const auth = (await this.getAccessToken()).access_token;

    const transaction = {
      CommandID: 'TransactionStatusQuery',
      // PartyA: 600998,
      PartyA: mpesaBusinessShortCode,
      IdentifierType: 4,
      Remarks: 'reversal',
      Initiator: 'testapi',
      SecurityCredential: securityCredential,
      QueueTimeOutURL: mpesaQueueTimeOutUrl,
      ResultURL: mpesaResultUrl,
      TransactionID: transactionID,
      Occasion: '',
    }

    const dataToSend = JSON.stringify(transaction);

    const result = await unirest('POST', mpesaTransactionStatusUrl).
    headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`
    }).
    send(dataToSend);

    console.log(result);
  }


  async getAccountBalance(){
    const auth = (await this.getAccessToken()).access_token;

    const transaction = {
      CommandID: 'AccountBalance',
      // PartyA: 600998,
      PartyA: 600426,
      IdentifierType: 4,
      Remarks: 'balance',
      Initiator: 'testapi',
      SecurityCredential: 'AVKFGUi5jjTugxtl5CNM01uSl923nS07WR5DddAkCFbvavCX6nbmroxemja5oWB1xMtDra6ltvUqMxDk8PNSz2QKnTSURlCloHNR8ecxP0WFC1fkPn/ImAkb+OOxosBct+7zJwXjwRcM4Jsp1ycEKaV5B70d4ICO58+wExYGXEK24okNxtyxjjp6asbqm+4+T/R+p3aHdNywYv2yxs+uMaAA1/UPSlfcPkV9M620tOajS0Ct4IQRv1eCDGAveIZa9KyDiLdUsryL22F0YYhPbELj/nLAc8grMKD5fB2OHJhEsmsz/1sPxyPII/X2prejXrs+mgLWc1kdX/KJS+K25g==',
      QueueTimeOutURL: mpesaQueueTimeOutUrl,
      ResultURL: mpesaResultUrl
    }

    const dataToSend = JSON.stringify(transaction);

    const result = await unirest('POST', 'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query').
    headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`
    }).
    send(dataToSend);

    console.log(JSON.parse(result.raw_body));
  }

  getMPesaTimeStamp() {
    //Generate MPesa Timestamp 

    let datenow = new Date();
    let year, month, date, hour, minute, second;

    year = datenow.getFullYear();
    month = datenow.getMonth() + 1;
    date = datenow.getDate();
    hour = datenow.getHours();
    minute = datenow.getMinutes();
    second = datenow.getSeconds();

    month < 10 ? (month = '0' + month) : (month = month);
    date < 10 ? (date = '0' + date) : (date = date);
    hour < 10 ? (hour = '0' + hour) : (hour = hour);
    minute < 10 ? (minute = '0' + minute) : (minute = minute);
    second < 10 ? (second = '0' + second) : (second = second);

    let timestamp = `${year}` + `${month}` + `${date}` + `${hour}` + `${minute}` + `${second}`;

    return timestamp;
  }
}
