import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // TODO - disable all origins for production
    app.enableCors({ origin: '*' });

    // Global exception filter to ensure consistent error response format
    app.useGlobalFilters(
        new (class {
            catch(exception: any, host: any) {
                const ctx = host.switchToHttp();
                const response = ctx.getResponse();

                if (exception instanceof HttpException) {
                    const status = exception.getStatus();
                    const message = exception.getResponse();

                    response.status(status).json({
                        message:
                            typeof message === 'string'
                                ? message
                                : (message as any)?.message ||
                                  'An error occurred',
                        status,
                        timestamp: new Date().toISOString(),
                    });
                } else {
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        message: 'Internal server error',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        timestamp: new Date().toISOString(),
                    });
                }
            }
        })(),
    );

    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
