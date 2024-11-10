import { createRoute } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { checkDatabaseConnection, executeQuery } from '../db/utils';
import { pool } from '../db/schema';
import { DatabaseTestResponseSchema } from '../schemas/responses';
import { MAX_RETRIES } from '../config/constants';

export const dbTestRoute = createRoute({
  method: 'get',
  path: '/test-db',
  tags: ['Database'],
  description: 'Test database connectivity and get version information',
  summary: 'Database Connection Test',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DatabaseTestResponseSchema,
        },
      },
      description: 'Database test successful',
    },
    500: {
      content: {
        'application/json': {
          schema: DatabaseTestResponseSchema,
        },
      },
      description: 'Database test failed',
    },
  },
});

export const handleDbTest = async (c: Context) => {
  const startTime = Date.now();
  let retryCount = 0;

  try {
    console.log('Testing database connection...');
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Failed to establish database connection');
    }

    const result = await executeQuery<{ version: string }>(
      'SELECT version()',
      [],
      MAX_RETRIES,
    );

    console.log('Database query successful');
    const response = {
      status: 'success' as const,
      version: result.rows[0].version,
      timestamp: new Date().toISOString(),
      details: {
        connectionTime: Date.now() - startTime,
        retryCount,
      },
    };

    return c.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Database test failed:', errorMessage);

    const errorResponse = {
      status: 'error' as const,
      message: errorMessage,
      poolStats: {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      },
      timestamp: new Date().toISOString(),
      details: {
        retryCount,
        connectionTime: Date.now() - startTime,
        error: errorMessage,
      },
    };

    return c.json(errorResponse, 500);
  }
};
