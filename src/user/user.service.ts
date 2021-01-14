import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { random } from 'lodash';
import * as moment from 'moment';

import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { PhoneValidation } from './entity/phoneValidation.entity';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthProviderEnum } from '../auth/enum/authProvider.enum';
import { SmsService } from '../sms/sms.service';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../roles/typed/role.enum';
import { sign } from 'jsonwebtoken';
import { DotenvService } from '../dotenv/dotenv.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PhoneValidation)
    private readonly phoneValidationRepository: Repository<PhoneValidation>,
    private readonly dotEnvConfigService: DotenvService,
    private readonly roleService: RolesService,
    private readonly smsService: SmsService,
  ) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // email 중복체크
      const isEmailDuplicated = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
          deletedAt: null,
        },
      });

      if (isEmailDuplicated) {
        throw new BadRequestException('EMAIL_DUPLICATED');
      }

      let hashedPassword: string | null = null;

      if (
        createUserDto.provider === AuthProviderEnum.LOCAL &&
        !createUserDto.password
      ) {
        throw new BadRequestException('MISSING_PASSWD');
      }

      hashedPassword = await this.hashPassword(createUserDto.password);

      const userInfo = createUserDto;
      const userRole = await this.roleService.getRole(RoleEnum.USER);

      const phoneValidation = await this.phoneValidationRepository.findOne({
        where: {
          phone: userInfo.phone,
        },
      });

      if (!phoneValidation || !phoneValidation.isValid) {
        throw new UnauthorizedException('INVALID_PHONE_VALIDATION');
      }

      // DB에 데이터 넣기
      const created = await this.userRepository.save({
        email: userInfo.email,
        password: hashedPassword,
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        role: userRole,
      });
      return created;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async sendPhoneValidationNumber(phone: string) {
    const randomValidationNumber = random(110000, 999999, false) + '';

    try {
      const userExist = await this.userRepository.findOne({
        where: {
          phone,
          deletedAt: null,
        },
      });

      if (userExist) {
        throw new BadRequestException('USER_ALREADY_EXIST');
      }

      const phoneNumberExist = await this.phoneValidationRepository.findOne({
        where: {
          phone,
        },
      });

      if (phoneNumberExist) {
        await this.phoneValidationRepository.remove(phoneNumberExist);
      }

      await this.phoneValidationRepository.save({
        phone,
        validationCode: randomValidationNumber,
      });

      return this.smsService.sendSMS(
        phone,
        `안녕하세요. 플레이 라이센스 본인인증 번호는 [${randomValidationNumber}] 입니다. `,
      );
    } catch (err) {
      console.error(err);
    }
  }

  async checkPhoneValidationCode(phone: string, code: string) {
    try {
      const phoneValidation = await this.phoneValidationRepository.findOne({
        where: { phone },
      });

      // 인증 시 validation 테이블에 휴대폰 번호 및 code 저장 해놓음
      if (!phoneValidation) {
        throw new NotFoundException('phone number not found'); // 404
      }

      // 인증기간 3분
      const expiredAt = moment(phoneValidation.createdAt).add(3, 'minute');
      if (moment().isBefore(expiredAt)) {
        phoneValidation.isValid = code === phoneValidation.validationCode;
        console.log(2);
        await this.phoneValidationRepository.save(phoneValidation);
        return phoneValidation.isValid;
      } else {
        // expired Code
        throw new ForbiddenException('expired'); // 403
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
