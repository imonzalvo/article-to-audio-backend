import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    next(err);
  });
  
  await app.listen(3000);
}
bootstrap();
