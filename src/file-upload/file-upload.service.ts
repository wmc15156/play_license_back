import { Injectable, Logger } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  constructor(private readonly awsService: AwsService) {}

  async uploadS3(
    file: Buffer,
    bucket: string,
    name: string,
    dirName: string,
  ): Promise<any> {
    const s3 = this.awsService.getS3();
    const params = {
      Bucket: bucket,
      Key: `${dirName}/${String(name)}`,
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
