import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DotenvService } from '../dotenv/dotenv.service';

@Injectable()
export class AwsService {
  // private readonly sns = new AWS.SNS({
  //   apiVersion: 'latest',
  //   region: 'us-east-1',
  // });

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
}
