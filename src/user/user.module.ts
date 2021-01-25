import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneValidation } from './entity/phoneValidation.entity';
import { User } from './entity/user.entity';
import { SmsModule } from '../sms/sms.module';
import { RolesModule } from '../roles/roles.module';
import { DotenvModule } from '../dotenv/dotenv.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PhoneValidation, ProviderAccount]),
    SmsModule,
    RolesModule,
    DotenvModule,
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
