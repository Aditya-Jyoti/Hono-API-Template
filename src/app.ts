import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import { openAPIConfig, swaggerConfig } from './config/swagger';
import { rootRoute, handleRoot } from './routes/root';
import { healthCheckRoute, handleHealthCheck } from './routes/health';
import { dbTestRoute, handleDbTest } from './routes/database';

const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.openapi(rootRoute, handleRoot);
app.openapi(healthCheckRoute, handleHealthCheck);
app.openapi(dbTestRoute, handleDbTest);

// Documentation
app.doc('/openapi.json', openAPIConfig);
app.get('/swagger', swaggerUI(swaggerConfig));
app.get('/doc', (c) => c.redirect('/swagger'));

export default app;
