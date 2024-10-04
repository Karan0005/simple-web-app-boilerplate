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
    //Setting Up Logger
    const appLogger = WinstonModule.createLogger({
        format: winston.format.uncolorize(),
        transports: LoggerTransports
    });

    //Setting Up Environment Variables
    await setupSecretValues(appLogger);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: true,
        rawBody: true
    });
    const configService = app.get(ConfigService);
    const routePrefix = configService.get('server.routePrefix') || 'api';
    const serverSecret: string = configService.get('server.secret') as string;
    const apiBaseURL: string = configService.get('server.apiBaseURL') as string;

    // Setting Up CORS Policy Security
    app.enableCors({
        origin: configService.get('server.appBaseURL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
    });

    // Setting Up URL Policy Security
    app.use(express.urlencoded({ extended: true }));

    //Setting Up Middleware
    app.useGlobalFilters(new ExceptionProcessor(appLogger));
    app.useGlobalInterceptors(new ResponseProcessor());
    app.useLogger(appLogger);
    app.setGlobalPrefix(routePrefix);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    //Setting Up Swagger Documentation
    app.use(
        ['/' + routePrefix + '/swagger', '/' + routePrefix + '/swagger-json'],
        basicAuth({
            users: {
                developer: serverSecret
            },
            challenge: true
        })
    );

    const options = new DocumentBuilder()
        .setTitle('Backend App')
        .setDescription('API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer(apiBaseURL)
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(routePrefix + '/swagger', app, document);

    // Setting Up Application Helmet Policy Security
    /**
     * This header helps prevent cross-site scripting (XSS) attacks by restricting the resources that can be loaded by the application
     * Helps prevent click jacking attacks by restricting the application from being embedded in a frame
     * This header helps prevent attackers from learning the technology stack used by the application
     * This header helps prevent man-in-the-middle (MITM) attacks by enforcing the use of HTTPS
     * This header helps prevent attackers from exploiting MIME type sniffing vulnerabilities by preventing browsers from guessing the content type
     * sets the X-XSS-Protection header to enable the browser's cross-site scripting (XSS) filter
     * This will control the amount of information sent in the "Referer" header, which can help protect against some types of attacks.
     *
     */
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

    //Initiating Server
    const port = configService.get('server.port');
    const server = await app.listen(port);
    appLogger.log(BaseMessage.Success.ServerStartUp + port);
    return { server, app, appLogger, apiBaseURL, routePrefix };
}

if (cluster.default.isPrimary && process.env.APP_ENV !== EnvironmentEnum.LOCAL) {
    // Get the number of CPUs, but allow for a configurable WORKER_COUNT
    const numCPUs = os.cpus().length;
    const workerCount = process.env.WORKER_COUNT ? parseInt(process.env.WORKER_COUNT, 10) : numCPUs;

    // Set a higher limit globally for all EventEmitters
    events.EventEmitter.defaultMaxListeners = numCPUs === 1 ? 2 : numCPUs;

    console.log(
        `Master process is running with PID ${process.pid}. Forking ${workerCount} workers...`
    );

    // Fork workers equal to WORKER_COUNT or number of CPUs
    for (let i = 0; i < workerCount; i++) {
        cluster.default.fork();
    }

    // If a worker dies, log the event and fork a new worker
    cluster.default.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
        cluster.default.fork();
    });
} else {
    // Each worker runs its own instance of the NestJS app
    bootstrap()
        .then(({ server, app, appLogger, apiBaseURL, routePrefix }) => {
            gracefulServerShutdown(server, app, cluster.default.worker);
            appLogger.log(BaseMessage.Success.BackendBootstrap(apiBaseURL + '/' + routePrefix));
        })
        .catch((error) => {
            console.error(JSON.stringify(error));
        });
}

function gracefulServerShutdown(
    server: Server,
    app: NestExpressApplication,
    worker: cluster.Worker | undefined
) {
    let activeConnections = 0;
    server.on('connection', (connection) => {
        activeConnections++;
        connection.on('close', () => activeConnections--);
    });

    worker?.on('exit', (code, signal) => {
        console.log(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
        process.exit(code);
    });

    const shutdown = async (signal: string) => {
        console.log(`Received shutdown signal (${signal}). Closing server...`);
        try {
            const timeout = setTimeout(async () => {
                console.log('Forcing shutdown due to timeout.');
                worker?.kill();
                process.exit(1);
            }, 20000);

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

            while (activeConnections > 0) {
                console.log(`Waiting for ${activeConnections} connections to finish...`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            await app.close();
            worker?.disconnect();
            console.log('Application shut down gracefully.');
        } catch (error) {
            console.log('Error occurred during graceful shutdown:', error);
        } finally {
            process.exit(0);
        }
    };

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
