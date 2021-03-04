import { Injectable, Logger } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import PhoneNumber from 'awesome-phonenumber';
@Injectable()
export class SmsService {
  private logger = new Logger(SmsService.name);
  constructor(private readonly awsService: AwsService) {}

  async sendSMS(phone: string, msg: string) {
    try {
      const ph = new PhoneNumber(phone, 'KR');

      const params = {
        Message: msg,
        PhoneNumber: ph.getNumber('e164'),
      };
      console.log('123');
      return await this.awsService
        .getSNS()
        .publish(params)
        .promise()
        .then((result) => {
          console.log(result);
          this.logger.log(`SMS sended to ${params.PhoneNumber} , msg: ${msg}`);
          return result;
        })
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      throw e;
    }
  }
}
