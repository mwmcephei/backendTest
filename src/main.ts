import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const cors = require("cors");
  const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
