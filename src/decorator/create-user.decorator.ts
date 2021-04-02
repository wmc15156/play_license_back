import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';
import { AdminAccountEntity } from '../admin/entity/adminAccount.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const GetProviderUser = createParamDecorator(
  (data, ctx: ExecutionContext): ProviderAccount => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const GetAdminUser = createParamDecorator(
  (data, ctx: ExecutionContext): AdminAccountEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
