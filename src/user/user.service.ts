import {
  BadRequestException,
  ConflictException,
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
import * as cryptoRandomString from 'crypto-random-string';

import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { PhoneValidation } from './entity/phoneValidation.entity';
import { CreateUserDto } from './dto/CreateUser.dto';
import { AuthProviderEnum } from '../auth/enum/authProvider.enum';
import { SmsService } from '../sms/sms.service';
import { RolesService } from '../roles/roles.service';
import { RoleEnum } from '../roles/typed/role.enum';
import { DotenvService } from '../dotenv/dotenv.service';
import { EmailService } from '../email/email.service';
import { UpdateUserDto } from '../auth/dto/updateUser.dto';
import { RolesEnum } from '../auth/enum/Roles.enum';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';
import { UserRepo } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PhoneValidation)
    private readonly phoneValidationRepository: Repository<PhoneValidation>,
    @InjectRepository(ProviderAccount)
    private readonly providerAccountRepository: Repository<ProviderAccount>,
    @InjectRepository(UserRepo)
    private readonly userRepo: UserRepo,

    private readonly dotEnvConfigService: DotenvService,
    private readonly roleService: RolesService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
  ) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  async create(createUserDto: CreateUserDto) {
    let userRole = null;
    try {
      // email 중복체크
      if (!createUserDto.role) {
        throw new BadRequestException('NO_ROLE_PARAMETER');
      }
      const isEmailDuplicated = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
          deletedAt: null,
        },
      });

      if (isEmailDuplicated) {
        throw new ConflictException('EMAIL_DUPLICATED');
      }

      let hashedPassword: string | null = null;

      if (
        createUserDto.provider === AuthProviderEnum.LOCAL &&
        !createUserDto.password
      ) {
        throw new BadRequestException('MISSING_PASSWD');
      }

      if(createUserDto.password) {
        hashedPassword = await this.hashPassword(createUserDto.password);
      }

      const userInfo = createUserDto;
      if (createUserDto.role === RolesEnum.USER) {
        userRole = await this.roleService.getRole(RoleEnum.USER);
      } else if (createUserDto.role === RolesEnum.PROVIDER) {
        userRole = await this.roleService.getRole(RoleEnum.PROVIDER);
      }
      console.log('---------3---------')
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
      // update 사용
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
      throw err;
    }
  }

  async checkPhoneValidationCode(phone: string, code: string) {
    try {
      const phoneValidation = await this.phoneValidationRepository.findOne({
        where: { phone },
      });

      console.log(phoneValidation);

      if(phoneValidation.validationCode !== code) {
        throw new BadRequestException({ fail: true });
      }

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

  async findOneByUserId(userId: number): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        userId,
        deletedAt: null,
      },
      relations: ['role'],
    });
    return user;
  }

  async findOneWithPrivateInfo(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        order: {
          userId: 'DESC',
        },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      if (user.deletedAt !== null) {
        throw new BadRequestException('DELETED_USER');
      }

      const userPasswd = await this.userRepository.findOne({
        where: {
          email,
        },
        order: {
          userId: 'DESC',
        },
        select: ['userId', 'password'],
      });

      if (userPasswd.password) {
        user.password = userPasswd.password;
      }

      return user;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findPasswordByEmail({ email }: { email: string }) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
          deletedAt: null,
        },
      });

      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      await this.setTempPasswordAndSendTempPasswordByEmail({
        user,
        email,
      });
    } catch (err) {
      throw err;
    }
  }
  async setTempPasswordAndSendTempPasswordByEmail({
    user,
    email,
  }: {
    user: User;
    email: string;
  }) {
    const tempPassword = cryptoRandomString({ length: 10 });
    const hashed = await this.hashPassword(tempPassword);

    await this.userRepository.save({
      ...user,
      password: hashed,
    });

    if (email) {
      await this.emailService.sendEmail({
        email,
        title: '[PlayLicense] 회원님의 임시 비밀번호가 발급되었습니다.',
        body: `
        <table
          background="#fff"
          style="align: center; display: flex; width: 300px; text-align: center; background: #fff; margin: 32px auto;"
        >
        
          <br/>
        
          <img
            src="https://user-images.githubusercontent.com/60249156/109866502-b2bcce00-7ca8-11eb-860f-6474447185d4.png"
            style="display: block; margin: 0 auto; width: 200px; height: auto;"
            width="300px"
          />
          
          <br/>
          
          <div style="display: block; margin: 16px auto 0 auto; width: 300px; padding: 16px; border-radius: 20px; border: solid 1px #bebebe;">
            <div style="display: block; margin: 16px 0 16px 0; font-size: 18px; font-weight: 100; width: 100%; text-align: center">
              <span>회원님의 임시 비밀번호가 <br/>발급되었습니다.</span>
            </div>
            
            <div style="display: block; margin: 32px 0 32px 0; font-size: 18px; font-weight: bold; width: 100%; text-align: center">
              <span>${tempPassword}</span>
            </div>
             
            <div style="display: block; font-size: 18px; font-weight: 100; width: 100%; text-align: center">
              <span>임시 비밀번호로 로그인 하신 후,<br/> 비밀번호를 변경하시기 바랍니다.</span>
            </div>
            
            <div class="test" style="margin: 32px auto 8px auto; display: flex; width: 200px; height: 50px; border-radius: 50px; 
                  background-color: #FF6B39; justify-content: center; align-items: center;" >
              <a href='https://rufree-junior-p1-sangsang-frontend-swart.vercel.app/login' 
              style="color: white; font-size: 16px; font-weight: bold; line-height: 50px; text-decoration: none">
              로그인하러가기</a>
            </div>
          </div>
          
          <br/>
          
          <div style="display: block; width: 300px; margin: 0 auto 16px auto;">
            <div style="display: block; width: 100%; text-align: center">
              <span style="margin: 16px auto; display: block; font-size: 13px; color: #858585; line-height: 1.5">이 이메일은 PLAY-LISENCE 계정 및 서비스의 <br/>중요한 변경사항을 알려드리기 위해 발송되었습니다.</span>
            </div>
            
            <div style="display: block; width: 100%; text-align: center">
              <span style="margin: 4px auto; display: block; font-size: 13px; color: #858585">ⓒ PLAY-LISENCE Corp.</span>
            </div>
          </div>
        </table>
      `,
      });
    }
  }

  async findByEmailByIncludingDeleted(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        relations: ['role'],
      });
      return user;
    } catch (err) {
      console.error(err);
    }
  }

  async unregister(user: User): Promise<void> {
    const { userId } = user;
    try {
      const findOneUser = await this.userRepository.findOne({
        where: { userId, deletedAt: null },
      });
      if (findOneUser) {
        findOneUser.deletedAt = new Date();
        await this.userRepository.save(findOneUser);
      } else {
        throw new NotFoundException('NO_USER');
      }
    } catch (err) {
      console.error(err);
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const { userId } = user;
    try {
      const findOneUser = await this.userRepository.findOne({
        where: { userId, deletedAt: null },
      });
      if (findOneUser) {
        if (updateUserDto.phone) {
          findOneUser.phone = updateUserDto.phone;
        }
        if (updateUserDto.password) {
          const hashedPassword = await this.hashPassword(
            updateUserDto.password,
          );
          findOneUser.password = hashedPassword;
        }
        return await this.userRepository.save(findOneUser);
      }

      throw new NotFoundException('NO_USER');
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async emailDuplicateCheck(email: string, provider: RolesEnum): Promise<void> {
    let findOneProvider = null;
    try {
      const findOneUser = await this.userRepository.findOne({
        where: { email },
      });

      if (provider === RolesEnum.PROVIDER) {
        findOneProvider = await this.providerAccountRepository.findOne({
          email,
        });
      }

      if (findOneUser || findOneProvider) {
        throw new ConflictException('EMAIL_DUPLICATED');
      }
    } catch (err) {
      throw err;
    }
  }

  async createAdmin(email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    try {
      const findAdmin = await this.userRepository.findOne({
        email,
        deletedAt: null,
      });

      if (findAdmin) {
        throw new ConflictException('DUPLICATED_EMAIL');
      }
      const adminRole = await this.roleService.getRole(RoleEnum.ADMIN);
      console.log('here');
      const createAdmin = await this.userRepository.save({
        email,
        password: hashedPassword,
        fullName: 'admin',
        phone: 'admin',
        role: adminRole,
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: new Date(),
      });

      return createAdmin;
    } catch (err) {
      console.error('error', err);
      throw err;
    }
  }

  async checkPassword(user: User, password: string) {
    const findUser = await this.userRepo.findUserForId(user.userId);
    console.log(password, findUser);
    return await bcrypt.compare(password, findUser.password);
  }

  checkNull(email: [string]) {
    if (typeof email === "undefined" || email === null || email[0] === "") {
      return true;
    } else {
      return false;
    }
  }

  async findEmail(phone: string):Promise<any> {
    const data:User = await this.userRepo.findEmail(phone);
    let { email } = data;

    const len = email.split('@')[0].length - 4;
    email = email.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
    return email;
  }

}
