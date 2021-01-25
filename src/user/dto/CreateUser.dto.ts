import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { AuthProviderEnum } from '../../auth/enum/authProvider.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../auth/enum/Roles.enum';

export class CreateUserDto {
  @ApiProperty({
    enum: AuthProviderEnum,
    description: 'example: local, google, naver, kakao',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(AuthProviderEnum)
  provider: AuthProviderEnum;

  // @ApiModelProperty({
  //   description: 'oauth 가입일 경우에만 보낸다.',
  // })
  // @IsOptional()
  // @IsNumber()
  // readonly providerLoginId: number;

  @ApiModelProperty({
    example: 'user@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty({
    description: 'oauth 가입일 경우 보내지 않아도 됨.',
    example: '123123',
  })
  @IsOptional()
  @IsString()
  readonly password: string;

  @ApiModelProperty({
    example: '김현진',
  })
  @IsNotEmpty()
  @IsString()
  readonly fullName: string;

  @ApiModelProperty({
    example: '01028100744',
    description: '숫자로만 이루어진 문자열',
  })
  @IsNotEmpty()
  @IsNumberString()
  readonly phone: string;

  @ApiModelProperty({
    example: 'provider or user',
  })
  @IsNotEmpty()
  @IsString()
  role: RolesEnum;

  @ApiModelProperty({
    description: '관리자 확인, test용',
  })
  @IsOptional()
  admin: Boolean;
}
