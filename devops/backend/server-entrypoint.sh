#!/bin/bash

# Log before the server starts
echo "$(date) - Starting the server..." | tee -a /var/log/server.log

# Start the NestJS server
node /app/dist/apps/backend/main

# Log after the server has stopped (this will execute when the server is terminated)
echo "$(date) - Server has stopped." | tee -a /var/log/server.log
