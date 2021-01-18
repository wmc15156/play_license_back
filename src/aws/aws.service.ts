import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DotenvService } from '../dotenv/dotenv.service';

@Injectable()
export class AwsService {
  // private readonly sns = new AWS.SNS({
  //   apiVersion: 'latest',
  //   region: 'us-east-1',
  // });

  private readonly ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'ap-northeast-1',
  });

  constructor(private readonly dotenvConfigService: DotenvService) {
    AWS.config.update({
      region: 'ap-northeast-2',
      accessKeyId: this.dotenvConfigService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.dotenvConfigService.get('AWS_SECRET_KEY'),
    });
  }

  getSNS() {
    return new AWS.SNS({
      apiVersion: '2010-03-31',
      region: 'ap-northeast-1',
    });
  }

  getSES() {
    return new AWS.SES({
      apiVersion: '2012-10-17',
      accessKeyId: this.dotenvConfigService.get('AWS_EMAIL_ACCESS_KEY_ID'),
      secretAccessKey: this.dotenvConfigService.get('AWS_EMAIL_SECRET_KEY'),
      region: 'us-east-2',
    });
  }
}
