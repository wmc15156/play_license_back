import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
