import { SwaggerUIOptions } from '@hono/swagger-ui';

export const openAPIConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Hono API Documentation',
    version: '1.0.0',
    description:
      'API documentation with enhanced database health monitoring and testing endpoints',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check and monitoring endpoints',
    },
    {
      name: 'Database',
      description: 'Database testing and diagnostics',
    },
    {
      name: 'General',
      description: 'General API endpoints',
    },
  ],
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['error'] },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
};

export const swaggerConfig: SwaggerUIOptions = {
  url: '/openapi.json',
  defaultModelsExpandDepth: 3,
  defaultModelExpandDepth: 3,
  docExpansion: 'list',
  filter: true,
  showExtensions: true,
  showCommonExtensions: true,
  displayRequestDuration: true,
};
