import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggerService } from './infrastructure/utils/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const loggerService = app.get(LoggerService);
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  await app.listen(3000);
}
bootstrap();
