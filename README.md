# Hono API Template

The all in one service template with prisma, postgresql and redis cache setup. Includes a CI/CD pipeline to deploy to a VPS via a docker compose.

## Tech stack

- [Hono](https://hono.dev/) -> api framework
- [Prisma](https://www.prisma.io/) -> orm
- [Postgresql](https://www.postgresql.org/) -> database
- [Redis](https://redis.io/) -> database caching
- [Prettier](https://prettier.io/) -> code formatting
- [ESLint](https://eslint.org/) -> linter and code integrity checker
- [Zod](https://zod.dev/) -> typescript form validation
- [Husky](https://typicode.github.io/husky/) -> pre commit hooks

## Project Structure

```
.
├── docker-compose.yml
├── Dockerfile
├── eslint.config.js
├── init.sh
├── lint-staged.config.js
├── package.json
├── pnpm-lock.yaml
├── prisma
│   ├── migrations
│   │   └── migration_lock.toml
│   └── schema.prisma
├── README.md
├── src
│   ├── index.ts
│   ├── lib
│   │   ├── prisma-client.ts
│   │   └── redis-client.ts
│   ├── routes
│   │   └── sample
│   │       ├── index.ts
│   │       └── routes.ts
│   └── utils
└── tsconfig.json
```
