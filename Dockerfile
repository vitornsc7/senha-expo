FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

ENV EXPO_PUBLIC_API_URL=http://localhost:3001

CMD ["npx", "expo", "start", "--web", "--port", "8081"]
