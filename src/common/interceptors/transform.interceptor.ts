/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    constructor(private reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                const message =
                    this.reflector.get<string>(
                        RESPONSE_MESSAGE_KEY,
                        context.getHandler(),
                    ) || 'Operation successful';

                const request = context.switchToHttp().getRequest();
                const requestId =
                    request.headers['x-request-id'] || crypto.randomUUID();

                // Check if data already has meta (e.g. pagination)
                const hasMeta =
                    data && typeof data === 'object' && 'meta' in data && 'data' in data;

                if (hasMeta) {
                    return {
                        success: true,
                        message,
                        meta: {
                            requestId,
                            timestamp: new Date().toISOString(),
                            ...data.meta,
                        },
                        data: data.data,
                    };
                }

                return {
                    success: true,
                    message,
                    //   meta: {
                    //     requestId,
                    //     timestamp: new Date().toISOString(),
                    //   },
                    data,
                };
            }),
        );
    }
}
