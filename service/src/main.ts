import { hostname } from 'os';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
    logger: WinstonModule.createLogger({
      level: ['development'].includes(process.env.NODE_ENV) ? 'debug' : 'info',
      transports: [
        new transports.Console({
          format: ['development'].includes(process.env.NODE_ENV)
            ? format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
              format.ms(),
              utilities.format.nestLike('Board Service Dev', {
                colors: true,
                prettyPrint: true,
              }),
            )
            : format.printf((msg) => {
              const logFormat = {
                hostname: hostname(),
                app: process.env.APP_NAME,
                environment: process.env.NODE_ENV,
                level: msg.level,
                msg: msg.message,
                product: 'Projects Boards Service',
                time: new Date().toISOString(),
              };

              return JSON.stringify(logFormat);
            }),
        }),
      ],
    }),
  });
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');

  // Set the global prefix for all routes
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: false,
        exposeDefaultValues: true,
      },
    }),
  );

  await app.listen(port);
}
bootstrap();