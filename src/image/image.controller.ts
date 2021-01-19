import {
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from '../file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';

@Controller('image')
export class ImageController {
  private readonly BUCKET_NAME = 'play-license';
  private readonly logger = new Logger(ImageController.name);
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly awsService: AwsService,
  ) {}

  @Post('/test')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTest(@UploadedFile() file) {
    const directoryName = 'test-dir';
    // fieldname: 'file',
    //   originalname: 'received_714476228667331.jpeg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff ed 00 6c 50 68 6f 74 6f 73 68 6f 70 20 33 2e 30 00 38 42 49 4d 04 04 00 00 00 00 00 4f ... 98283 more bytes>,
    //   size: 98333
    const { originalname } = file;
    await this.uploadS3(file.buffer, this.BUCKET_NAME, originalname);
    console.log(file);
  }

  async uploadS3(file: Buffer, bucket: string, name: string) {
    const s3 = this.awsService.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          this.logger.error(err);
          reject(err.message);
        }
        console.log(data);
        resolve(data);
      });
    });
  }
}
