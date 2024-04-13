import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Bookamrks webapp')
    .setDescription(
      'this api for a app to social bookmark follow peploe and see bokmarks',
    )
    .setVersion('0.1')
    .build();
  app.setGlobalPrefix('/api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3001);
}
bootstrap();
