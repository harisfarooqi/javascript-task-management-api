# Step 1: Use Node.js base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci --omit=dev

# Step 5: Copy application code
COPY . .
# Step 6: Start application
EXPOSE 4000

CMD ["npm", "start"]