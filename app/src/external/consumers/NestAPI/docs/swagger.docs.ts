import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

export class SwaggerDoc {
  setupDocs = (app: INestApplication) => {
    const title = 'Tech Challenge Phase Four - Store Microservice';
    const description = `Store management microservice. Handles store registration, configuration, and operational settings for the cafeteria system.`;
    const version = '4.0.0';

    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          in: 'header',
        },
        'access-token',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
        'api-key',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'totem-access-token',
          in: 'header',
        },
        'totem-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
    writeFileSync('./swagger-docs.json', JSON.stringify(document));
  };
}
