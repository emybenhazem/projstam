# Stage 1: Build the Angular application
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the application from a lightweight web server
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/role-based-dashboard-app /usr/share/nginx/html
EXPOSE 80
