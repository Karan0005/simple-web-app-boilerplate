import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import { BaseMessage } from '../messages';

export const NumberTransformProcessor = (params: TransformFnParams) => {
    try {
        return parseInt(params.value);
    } catch (error) {
        throw new BadRequestException(BaseMessage.Error.InvalidNumber);
    }
};
