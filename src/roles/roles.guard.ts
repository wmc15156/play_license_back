import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entity/user.entity';
import { RoleEnum } from './typed/role.enum';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(123);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const provider = request.user as ProviderAccount
    console.log('providerId' in provider)
    const hasRole = () =>
      user.role && roles.includes(user.role.role) ||
      user.role && user.role.role === RoleEnum.ADMIN ||
      user.role && user.role.role === RoleEnum.PROVIDER ||
      provider && 'providerId' in provider
    return user && (user.role || provider.providerId) && hasRole();
  }
}
