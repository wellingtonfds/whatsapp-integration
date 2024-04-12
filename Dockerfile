# Start from the latest Ubuntu image
FROM registry.access.redhat.com/ubi8/nodejs-18

ENV HOST 0.0.0.0

EXPOSE 3000

USER root

# Create directory for our application
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY ./src/ ./src/
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./nest-cli.json ./
COPY ./.prettierrc ./
COPY ./.eslintrc.js ./
COPY ./prisma ./

# Install dependencies
RUN pnpm install

# Generate Private Key
#RUN chmod +x generate_pkey.sh  # Make the script executable
#RUN ./generate_pkey.sh  # Generate the private key

# Build the application
RUN pnpm prisma generate
RUN pnpm build
# Start the application
CMD ["pnpm", "start:prod"]
