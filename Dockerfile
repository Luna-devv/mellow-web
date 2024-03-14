FROM node:latest
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]