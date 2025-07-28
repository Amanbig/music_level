import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
    cors: true,
  });

const configService = app.get(ConfigService);

app.set("trust proxy", 1);

app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      configService.get<string>("FRONTEND_URL", "http://localhost:3000"),
      configService.get<string>("CORS_ORIGIN", "http://localhost:3000"),
      "http://localhost:3000",
    ];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (configService.get<string>("NODE_ENV") === "development") {
      // In development, allow all origins
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: configService.get<boolean>("CORS_CREDENTIALS", true),
  methods: configService
    .get<string>("CORS_METHODS", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS")
    .split(","),
  allowedHeaders: configService
    .get<string>(
      "CORS_ALLOWED_HEADERS",
      "Content-Type,Accept,Authorization,X-Requested-With,Origin,Access-Control-Request-Method,Access-Control-Request-Headers",
    )
    .split(","),
});

app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();