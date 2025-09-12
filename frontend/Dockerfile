# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./

RUN npm install

# Copy the rest of the frontend source
COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
