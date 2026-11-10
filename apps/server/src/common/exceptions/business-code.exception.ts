import { HttpException } from '@nestjs/common';

export class BusinessCodeException extends HttpException {
    constructor(
        status: number,
        readonly businessCode: number,
        message: string,
    ) {
        super({ message }, status);
    }
}
