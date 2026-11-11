import type { FastifyRequest } from 'fastify';
import type { AccessTokenClaims } from './access-token.service.js';

export interface AuthenticatedRequest extends FastifyRequest {
    user: AccessTokenClaims;
}
