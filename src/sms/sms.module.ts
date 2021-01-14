import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
