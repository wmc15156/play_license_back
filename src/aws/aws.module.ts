import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { DotenvModule } from '../dotenv/dotenv.module';

@Module({
  imports: [DotenvModule],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
