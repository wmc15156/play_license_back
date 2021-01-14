import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneValidation } from './entity/phoneValidation.entity';
import { User } from './entity/user.entity';
import { SmsModule } from '../sms/sms.module';
import { RolesModule } from '../roles/roles.module';
import { DotenvModule } from '../dotenv/dotenv.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PhoneValidation]),
    SmsModule,
    RolesModule,
    DotenvModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
