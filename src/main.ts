import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ExceptionFilter } from "./common/filters/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3002, "0.0.0.0");
}

bootstrap();
