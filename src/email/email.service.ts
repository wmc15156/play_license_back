import { Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class EmailService {
  constructor(private readonly awsService: AwsService) {}

  async sendEmail({
    email,
    title,
    body,
  }: {
    email: string;
    title: string;
    body: string;
  }) {
    return new Promise((resolve, reject) => {
      this.awsService.getSES().sendEmail(
        {
          Source: 'noreply@api.shortlysoftware.com',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: 'PLAY-LICENSE 회원님의 임시 비밀번호가 발급되었습니다.',
              Charset: 'utf-8',
            },
            Body: {
              Html: {
                Data: body,
                Charset: 'utf-8',
              },
            },
          },
        },
        (err, data) => {
          if (err) {
            console.log(err);
          }
          console.log(data);
          resolve(data);
        },
      );
    });
  }
}
