import { Module } from '@nestjs/common';
import { UserSchema } from 'src/schemas/user.schema';
import { SimpleauthController } from './simpleauth.controller';
import { SimpleauthService } from './simpleauth.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [SimpleauthController],
  providers: [SimpleauthService]
})
export class SimpleauthModule { }
