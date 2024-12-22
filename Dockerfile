FROM node:20-slim 

RUN npm install -g pnpm

COPY . /app
WORKDIR /app

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "dev"]