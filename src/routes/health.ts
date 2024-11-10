import { createRoute } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { checkDatabaseConnection, executeQuery } from '../db/utils';
import { pool } from '../db/schema';
import { HealthCheckResponseSchema } from '../schemas/responses';

export const healthCheckRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  description: 'Check the health status of the API and database connection',
  summary: 'API Health Check',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthCheckResponseSchema,
        },
      },
      description: 'System is healthy',
    },
    503: {
      content: {
        'application/json': {
          schema: HealthCheckResponseSchema,
        },
      },
      description: 'System is unhealthy',
    },
  },
});

export const handleHealthCheck = async (c: Context) => {
  const startTime = Date.now();

  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    const result = await executeQuery<{ now: string }>('SELECT NOW()');
    const responseTime = Date.now() - startTime;

    const response = {
      status: 'healthy' as const,
      timestamp: result.rows[0].now,
      database: 'connected' as const,
      details: {
        poolInfo: {
          totalCount: pool.totalCount,
          idleCount: pool.idleCount,
          waitingCount: pool.waitingCount,
        },
        lastCheckTime: new Date().toISOString(),
        responseTime,
      },
    };

    return c.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Health check failed:', errorMessage);

    const errorResponse = {
      status: 'unhealthy' as const,
      error: errorMessage,
      database: 'disconnected' as const,
      timestamp: new Date().toISOString(),
      details: {
        poolInfo: {
          totalCount: pool.totalCount,
          idleCount: pool.idleCount,
          waitingCount: pool.waitingCount,
        },
        lastCheckTime: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      },
    };

    return c.json(errorResponse, 503);
  }
};
