/* eslint-disable no-console */
import { ExceptionProcessor, ResponseProcessor } from '@backend/utilities';
import { BaseMessage, EnvironmentEnum } from '@full-stack-project/shared';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cluster from 'cluster';
import events from 'events';
import * as express from 'express';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { Server } from 'http';
import { WinstonModule } from 'nest-winston';
import * as os from 'os';
import * as winston from 'winston';
import { LoggerTransports, setupSecretValues } from './config';
import { AppModule } from './modules/app.module';

async function bootstrap() {
    // Initialize a Winston logger for the application
    const appLogger = WinstonModule.createLogger({
        format: winston.format.uncolorize(),
        transports: LoggerTransports
    });

    // Set up environment variables (e.g., API keys or sensitive values)
    await setupSecretValues(appLogger);

    // Create a new NestJS Express application
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: true,
        rawBody: true
    });

    // Fetch configuration values for routes and server settings
    const configService = app.get(ConfigService);
    const routePrefix = configService.get('server.routePrefix') || 'api';
    const serverSecret: string = configService.get('server.secret') as string;
    const apiBaseURL: string = configService.get('server.apiBaseURL') as string;

    // Enable CORS with allowed origins, methods, and headers
    app.enableCors({
        origin: configService.get('server.appBaseURL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
    });

    // Allow URL-encoded data parsing for incoming requests
    app.use(express.urlencoded({ extended: true }));

    // Apply global exception filter and response interceptor
    app.useGlobalFilters(new ExceptionProcessor(appLogger));
    app.useGlobalInterceptors(new ResponseProcessor());

    // Use custom logger for logging across the app
    app.useLogger(appLogger);

    // Set a global route prefix (e.g., '/api')
    app.setGlobalPrefix(routePrefix);

    // Apply global validation with transformation and strict whitelisting
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    // Set up basic authentication for accessing Swagger documentation
    app.use(
        ['/' + routePrefix + '/swagger', '/' + routePrefix + '/swagger-json'],
        basicAuth({
            users: {
                developer: serverSecret
            },
            challenge: true
        })
    );

    // Configure Swagger documentation settings
    const options = new DocumentBuilder()
        .setTitle('Backend App')
        .setDescription('API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer(apiBaseURL)
        .build();

    // Generate the Swagger document and set up the endpoint
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(routePrefix + '/swagger', app, document);

    // Apply Helmet for security (e.g., XSS prevention, frameguard, HSTS)
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'default-src': ["'none'"],
                    'script-src': ["'self'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:'],
                    'font-src': ["'self'"],
                    'connect-src': ["'self'"],
                    'media-src': ["'self'"],
                    'object-src': ["'none'"],
                    'base-uri': ["'self'"],
                    'form-action': ["'self'"],
                    'frame-ancestors': ["'none'"],
                    'upgrade-insecure-requests': [],
                    'block-all-mixed-content': [],
                    sandbox: ['allow-scripts', 'allow-same-origin']
                }
            },
            frameguard: { action: 'deny' },
            hidePoweredBy: true,
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            noSniff: true,
            xssFilter: true,
            referrerPolicy: { policy: 'same-origin' },
            crossOriginEmbedderPolicy: true,
            crossOriginOpenerPolicy: { policy: 'same-origin' }
        })
    );

    // Start the server and listen on the configured port
    const port = configService.get('server.port');
    const server = await app.listen(port);
    appLogger.log(BaseMessage.Success.ServerStartUp + port);

    // Return the server and related instances
    return { server, app, appLogger, apiBaseURL, routePrefix };
}

if (cluster.default.isPrimary && process.env.APP_ENV !== EnvironmentEnum.LOCAL) {
    // Master process: create worker processes based on CPU count
    const numCPUs = os.cpus().length;
    const workerCount = process.env.WORKER_COUNT ? parseInt(process.env.WORKER_COUNT, 10) : numCPUs;

    // Set the maximum number of listeners for events
    events.EventEmitter.defaultMaxListeners = numCPUs === 1 ? 2 : numCPUs;

    console.log(
        `Master process is running with PID ${process.pid}. Forking ${workerCount} workers...`
    );

    // Fork worker processes for each CPU core
    for (let i = 0; i < workerCount; i++) {
        cluster.default.fork();
    }

    // Restart a worker if it dies unexpectedly
    cluster.default.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
        cluster.default.fork();
    });
} else {
    // Worker process: start the NestJS app instance
    bootstrap()
        .then(({ server, app, appLogger, apiBaseURL, routePrefix }) => {
            gracefulServerShutdown(server, app, cluster.default.worker);
            appLogger.log(BaseMessage.Success.BackendBootstrap(apiBaseURL + '/' + routePrefix));
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
        });
}

// Gracefully handle server shutdown on receiving termination signals
function gracefulServerShutdown(
    server: Server,
    app: NestExpressApplication,
    worker: cluster.Worker | undefined
) {
    let activeConnections = 0;

    // Track active connections to allow graceful shutdown
    server.on('connection', (connection) => {
        activeConnections++;
        connection.on('close', () => activeConnections--);
    });

    // Handle worker exit events
    worker?.on('exit', (code, signal) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
        process.exit(code);
    });

    // Shutdown logic to handle different termination signals
    const shutdown = async (signal: string) => {
        console.log(`Received shutdown signal (${signal}). Closing server...`);
        try {
            // Set a timeout to force shutdown if it takes too long
            const timeout = setTimeout(async () => {
                console.log('Forcing shutdown due to timeout.');
                worker?.kill();
                process.exit(1);
            }, 20000);

            // Close the server and wait for existing connections to finish
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    clearTimeout(timeout);
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Wait until all active connections are closed
            while (activeConnections > 0) {
                console.log(`Waiting for ${activeConnections} connections to finish...`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            // Close the NestJS application instance
            await app.close();
            worker?.disconnect();
            console.log('Application shut down gracefully.');
        } catch (error) {
            console.log('Error occurred during graceful shutdown:', error);
        } finally {
            process.exit(0);
        }
    };

    // Attach signal handlers for SIGINT, SIGTERM, and unhandled exceptions/rejections
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (error) => {
        console.log('Uncaught exception:', error);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (error) => {
        console.log('Unhandled rejection:', error);
        shutdown('unhandledRejection');
    });
}
