# Stage 1 - the build process
FROM node:8.11.1 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Second FROM discards everything previously
FROM nginx:1.12-alpine
ENV REACT_APP_DATASTORE 'http://localhost:3001'
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]