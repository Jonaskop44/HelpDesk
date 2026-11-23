import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'node:fs';
import { AppModule } from './app.module.js';
import { AppConfigService } from './config/app-config/app-config.service.js';
import { buildSwaggerDocument } from './swagger.config.js';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const CONFIG_SERVICE = app.get(AppConfigService);

  app.setGlobalPrefix(CONFIG_SERVICE.globalPrefix);

  const document = buildSwaggerDocument(app);
  writeFileSync('openapi.json', `${JSON.stringify(document, null, 2)}\n`);

  await app.close();
  console.log('OpenAPI document written to openapi.json');
}

await generate();
