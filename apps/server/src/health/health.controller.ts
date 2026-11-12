import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { BypassTransform } from '@/common/decorators/bypass-transform.decorator.js';
import { RedisService } from '@/redis/redis.service.js';

@Controller('health')
export class HealthController {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
    ) {}

    @BypassTransform()
    @Get()
    async check(): Promise<{ status: 'ok'; database: 'ok'; redis: 'ok' }> {
        try {
            // 执行轻量级查询，确认数据库当前确实可访问。
            await this.prismaService.$queryRaw`SELECT 1`;
            // 检查 Redis 连接可正常执行命令。
            await this.redisService.ping();
        } catch {
            // 不向调用方暴露数据库内部错误，统一返回服务不可用状态。
            throw new ServiceUnavailableException({
                status: 'error',
                database: 'unavailable',
            });
        }

        return { status: 'ok', database: 'ok', redis: 'ok' };
    }
}
