import { ApiProperty } from '@nestjs/swagger';

export class FindByEmailQuery {
  @ApiProperty()
  email: string;
}
