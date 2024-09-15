import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const ControllerExceptionProcessor = (
    error: unknown
): HttpException | InternalServerErrorException => {
    try {
        return new InternalServerErrorException(error);
    } catch (error) {
        return new InternalServerErrorException(error);
    }
};
