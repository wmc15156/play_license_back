import { Body, Controller, Get, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

import { CurationService } from './curation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CurationInfo } from './entity/CurationInfo.entity';
import { Repository } from 'typeorm';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RolesEnum } from '../auth/enum/Roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from '../user/entity/user.entity';
import { GetUser } from '../decorator/create-user.decorator';
import { CreateCurationDto } from './dto/createCuration.dto';

@ApiTags('curation')
@Controller('curation')
export class CurationController {
  constructor(
    private readonly curationService: CurationService,
    
    @InjectRepository(CurationInfo)
    private readonly curationRepository: Repository<CurationInfo>
  ) {}

  @Post('/')
  @ApiOperation({ summary: '큐레이션 등록'})
  @Roles(RolesEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse( { status: 201, description: 'success'})
  @ApiResponse({ status: 409, description: 'already exist curation'})
  async createCuration(@GetUser() user: User, @Body(ValidationPipe) createCurationDto: CreateCurationDto, @Res() res: Response) {
    await this.curationService.createCuration(createCurationDto);
    return res.status(201).send('success');
  }

}
