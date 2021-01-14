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

export class CreateUserDto {
  @ApiProperty({
    enum: AuthProviderEnum,
  })
  @IsNotEmpty()
  @IsEnum(AuthProviderEnum)
  readonly provider: AuthProviderEnum;

  @ApiModelProperty({
    description: 'oauth 가입일 경우에만 보낸다.',
  })
  @IsOptional()
  @IsNumber()
  readonly providerLoginId: number;

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
    example: '01000000000',
  })
  @IsNotEmpty()
  @IsNumberString()
  readonly phone: string;
}
