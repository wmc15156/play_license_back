import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './typed/role.enum';

@Injectable()
export class RolesService {
  private logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    this.initialRoles();
  }

  async initialRoles() {
    try {
      const adminRole = await this.roleRepository.findOne({
        where: {
          role: RoleEnum.ADMIN,
        },
      });
      if (!adminRole) {
        this.logger.log('Initial Log');

        await this.roleRepository.save({
          role: RoleEnum.ADMIN,
          description: 'Administrator',
        });

        await this.roleRepository.save({
          role: RoleEnum.USER,
          description: 'general user',
        });
      }
    } catch (err) {
      this.logger.log(err);
    }
  }

  async getRole(role: RoleEnum) {
    const roleName = await this.roleRepository.findOne({
      where: {
        role,
      },
    });

    if (!roleName) {
      throw new NotFoundException('ROLE_NOT_FOUND :' + roleName);
    }

    return roleName;
  }
}
