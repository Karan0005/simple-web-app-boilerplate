# Use an image with the specified Node.js and npm versions
FROM node:20.17.0 AS build

# Copy complete code base to docker
COPY . /app

# Set the working directory
WORKDIR /app

# Set default build-time argument for APP_ENV (not used directly)
ARG APP_ENV='LOCAL'

# Set runtime environment variable for APP_ENV
ENV APP_ENV=${APP_ENV}

# Install all dependencies and test project
RUN npm install
RUN npm run frontend:lint
RUN npm run frontend:test

# Build Stage
RUN echo "Building with APP_ENV=${APP_ENV}..." && \
    if [ "$APP_ENV" = "PROD" ]; then \
        echo "Running production build"; \
        npx nx build frontend --configuration prod --skip-nx-cache --verbose; \
    elif [ "$APP_ENV" = "UAT" ]; then \
        echo "Running UAT build"; \
        npx nx build frontend --configuration uat --skip-nx-cache --verbose; \
    elif [ "$APP_ENV" = "DEV" ]; then \
        echo "Running development build"; \
        npx nx build frontend --configuration dev --skip-nx-cache --verbose; \
    else \
        echo "Running local build"; \
        npx nx build frontend --configuration local --skip-nx-cache --verbose; \
    fi

# Serve the app using nginx
FROM nginx:alpine

# Copy the build artifacts from the build stage
COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html

# Set default build-time argument for PORT_FRONTEND (not used directly)
ARG PORT_FRONTEND=80

# Set runtime environment variable for PORT_FRONTEND
ENV PORT_FRONTEND=${PORT_FRONTEND}

# Print the value of PORT during build
RUN echo "The PORT_FRONTEND environment variable is set to ${PORT_FRONTEND}"

# Directly replace the default Nginx configuration with your local configuration
COPY --from=build /app/devops/frontend/nginx.conf /etc/nginx/conf.d/default.conf.template

# Expose the port for Docker (not used by Nginx but good practice)
EXPOSE ${PORT_FRONTEND}

# Use envsubst to replace ${PORT_FRONTEND} in the Nginx configuration at runtime
CMD envsubst '${PORT_FRONTEND}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
