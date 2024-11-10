import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import type { Context } from 'hono';

const RootResponseSchema = z.object({
  message: z.string(),
});

export const rootRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['General'],
  description: 'Root endpoint returning API status',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RootResponseSchema,
        },
      },
      description: 'Successful response',
    },
  },
});

export const handleRoot = (c: Context) => {
  const response = {
    message: 'Hello Hono!',
  };
  return c.json(response);
};
