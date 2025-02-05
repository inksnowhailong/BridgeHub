"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./framework/app.module");
const common_1 = require("@nestjs/common");
const Request_interceptor_1 = require("./framework/Interceptor/Request.interceptor");
const global_exception_1 = require("./framework/exception/global.exception");
const nest_exception_1 = require("./shared/exception/nest.exception");
const ErrorHandlers_1 = require("./shared/exception/ErrorHandlers");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true
    }));
    app.useGlobalInterceptors(new Request_interceptor_1.RequestInterceptor());
    const nestException = new nest_exception_1.NestException();
    nestException.LinkErrhandlers([
        new ErrorHandlers_1.HttpExceptionErrorHandler(),
        new ErrorHandlers_1.TypeormExceptionErrorHandler(),
        new ErrorHandlers_1.DefaultErrorHandler()
    ]);
    app.useGlobalFilters(new global_exception_1.AllExceptionFilter(nestException));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map