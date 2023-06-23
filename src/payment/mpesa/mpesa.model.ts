import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
  CustomerPayBillOnline = 'CustomerPayBillOnline',
  CustomerBuyGoodsOnline = 'CustomerBuyGoodsOnline'
}

const baseUrl = 'https://moneris.eastus.cloudapp.azure.com:8080/'
// const baseUrl = 'http://localhost:5000'

export const mpesaSTKPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
export const mpesaAccessTokenUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
export const mpesaBusinessShortCode = 174379;
export const consumerSecret = 'XYmouDBIapMt45Ec';
export const consumerKey = 'qSBzkuTUZiAVcjRh6I6Rap0omyGbrupU';
export const passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
export const callBackUrl = `${baseUrl}/mpesa/callback`; // url to be used for responses from the mpesa api
export const mpesaReversalUrl = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request';
export const mpesaTransactionStatusUrl = 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query';
export const mpesaQueueTimeOutUrl = `${baseUrl}/mpesa/queueTimeOut`;
export const mpesaResultUrl = `${baseUrl}/mpesa/result`;
export const securityCredential = 'm7d4nHV8tDW0d9yUjvGpLoP98F2EMtWgsv0IfDVYyBjOWz6N7xtIARWy9NveC7tJjdidBlVVJlnlKqBTVUNGtznjCRL2qYjeAKcgDIxjWELF49cTN9fikArohk+f3O7Vj5x96s8q6tGqePAaI7n84V+HN1fSjLGY7yvFVcbezdTTNa8iaEjcUe99GcpEaCKS3hREz3KXbKbFI3TfZ25IsukDoXTL0B/auRnKoAzEIiUnmk2B9D777rYnuphR/MkaaaGxGO/h06Ig42LtwF25StTsBx781Z/EycxoGz2KaJ8lUb0xj3bl9a8FVTaDk5DyMMUnESHiGzwqQk3cng2l2g==';


@Schema({
  timestamps: true,
})
export class MPESA extends Document {
  @Prop()
  //paybill or till number
  businessShortCode: number;

  @Prop()
  //this is the password used for encrypting the request sent: A base64 encoded string. (the base64 string is a combination of Shortcode+Passkey+Timestamp)
  password: string;

  @Prop()
  //this is the timestamp of the transaction, normally in the format of YEAR+MONTH+DATE+HOUR+MINUTE+SECOND (YYYYMMDDHHMMSS)
  timeStamp: string;

  @Prop()
  //This is the transaction type that is used to identify the transaction when sending the request to M-PESA.
  //The transaction type for M-PESA Express is "CustomerPayBillOnline" for PayBill Numbers and "CustomerBuyGoodsOnline" for Till Numbers
  transactionType: string;

  @Prop()
  //amount to be paid by customer
  amount: number;

  @Prop()
  //phone number sending the money/making payments
  partyA: string;

  @Prop()
  //recepient of the payment
  //the organization receiving the funds. the parameter expected is a 5 to 6 digit as defined on the Shortcode description above. this can be the same as businessShortCode value above.
  partyB: number;

  @Prop()
  //the mobile number to receive the STK Pin Prompt. this number can be the same as partyA value above.
  phoneNumber: string;

  @Prop()
  //URL that is used to receive notifications from MPesa API. It is the endpoint to which the results will be sent by MPesa API.
  callBackUrl: string;

  @Prop()
  // an Alpha-Numeric parameter that is defined by your system as an Identifier of the transaction for CustomerPayBillOnline transaction type.
  // Along with the business name, this value is also displayed to the customer in the STK Pin Prompt message. Maximum of 12 characters.
  accountReference: string;

  @Prop()
  //short description about the actual transaction
  transactionDesc: string;

  @Prop()
  //a global unique Identifier for any submitted payment request
  merchantRequestID: string;

  @Prop()
  //a global unique identifier of the processed checkout transaction request
  checkoutRequestID: string;

  @Prop()
  //numeric status code that indicates the status of the transaction submission. 0 means successful submission and any other code means an error occurred.
  responseCode: string;

  @Prop()
  // an acknowledgment message from the API that gives the status of the request submission
  responseDescription: string;

  @Prop()
  //message that your system can display to the Customer as an acknowledgement of the payment request submission.
  customerMessage: string;

  @Prop()
  // numeric status code that indicates the status of the transaction processing. 0 means successful processing and any other code means an error occured or the transaction failed.
  resultCode: string;

  @Prop()
  // description of the result of the transaction
  resultDescription: string;

  @Prop()
  mpesaReceiptNumber: string;

  @Prop()
  transactionDate: Date;
}

export const mpesaSchema = SchemaFactory.createForClass(MPESA);

export interface DTOMPESA {
  phoneNumber: string;
  amount: number;
  transactionType?: TransactionType;
  transactionDescription?: string;
  accountReference?: string
}

export interface DTOrEVERSAL {
  phoneNumber: string;
  amount: number;
  transactionType?: TransactionType;
  transactionDescription?: string;
  accountReference?: string
}
