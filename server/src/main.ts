import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfigService } from './config/app-config/app-config.service.js';
import { SwaggerModule } from '@nestjs/swagger';
import { buildSwaggerDocument } from './swagger.config.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });
  const CONFIG_SERVICE = app.get(AppConfigService);

  app.setGlobalPrefix(CONFIG_SERVICE.globalPrefix);

  SwaggerModule.setup(
    `${CONFIG_SERVICE.globalPrefix}/api-docs`,
    app,
    buildSwaggerDocument(app),
    {
      jsonDocumentUrl: `${CONFIG_SERVICE.globalPrefix}/api-docs-json`,
    },
  );

  await app.listen(CONFIG_SERVICE.port);
}
await bootstrap();
