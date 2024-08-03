"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true,
    });
    app.use((err, req, res, next) => {
        console.error('Global error handler:', err);
        next(err);
    });
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map