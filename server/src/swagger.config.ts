import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildSwaggerDocument(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Helpdesk')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addCookieAuth('helpdesk.session_token')
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}
