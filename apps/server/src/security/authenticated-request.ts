import type { FastifyRequest } from 'fastify';
import type { AccessTokenClaims } from '@/security/access-token.service.js';

export interface AuthenticatedRequest extends FastifyRequest {
    user: AccessTokenClaims;
}
