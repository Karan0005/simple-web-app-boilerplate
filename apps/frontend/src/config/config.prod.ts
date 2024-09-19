import { EnvironmentEnum } from '@full-stack-project/shared';

export const CONFIG = {
    environment: EnvironmentEnum.PROD,
    production: true,
    apiUrl: 'http://prod.domain.com/api',
    logLevel: 'error',
    enableDebugTools: false
};
