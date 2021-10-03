import { Module } from '@nestjs/common';
import { XlsxParserModule } from './xlsx-parser/xlsx-parser.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './api/api.module';
import { SimpleauthModule } from './simpleauth/simpleauth.module';



@Module({
  imports: [
    MongooseModule.forRoot(
      //    'mongodb+srv://mwm:matthias88@cluster0.f8xt0.mongodb.net/testDataDB?retryWrites=true&w=majority',
      'mongodb+srv://mwm:mwm@cluster0.drn93.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    ),
    XlsxParserModule,
    ApiModule,
    SimpleauthModule
  ],
})
export class AppModule { }
