import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { ProviderAccount } from '../auth/entity/providerAccount.entity';

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
