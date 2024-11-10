import { z } from '@hono/zod-openapi';

export const ErrorSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
  error: z.string(),
  details: z.object({
    timestamp: z.string(),
    retryCount: z.number().optional(),
    poolInfo: z
      .object({
        totalCount: z.number(),
        idleCount: z.number(),
        waitingCount: z.number(),
      })
      .optional(),
  }),
});

export const HealthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']),
  error: z.string().optional(),
  details: z
    .object({
      poolInfo: z.object({
        totalCount: z.number(),
        idleCount: z.number(),
        waitingCount: z.number(),
      }),
      lastCheckTime: z.string(),
      responseTime: z.number().optional(),
    })
    .optional(),
});

export const DatabaseTestResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  version: z.string().optional(),
  message: z.string().optional(),
  poolStats: z
    .object({
      totalCount: z.number(),
      idleCount: z.number(),
      waitingCount: z.number(),
    })
    .optional(),
  timestamp: z.string(),
  details: z
    .object({
      retryCount: z.number().optional(),
      connectionTime: z.number().optional(),
      error: z.string().optional(),
    })
    .optional(),
});
