import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BaseMessage, HealthCheckSuccessResponse, IRootRouteResponse } from '../utilities';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private appService: AppService) {}

    @Get()
    @ApiExcludeEndpoint()
    async rootRoute(): Promise<IRootRouteResponse> {
        return await this.appService.rootRoute();
    }

    @Get('health')
    @ApiOperation({ summary: 'Health Route.' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: HealthCheckSuccessResponse
    })
    async checkHealth() {
        return await this.appService.checkHealth();
    }
}
