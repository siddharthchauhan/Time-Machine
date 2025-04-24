
#!/bin/bash
set -e

# Build and start services
echo "Building and starting services..."
docker-compose up -d --build

echo "Application is running on http://localhost:8080"

# Check containers status
echo "Checking container status..."
docker-compose ps
