import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'cart-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-1',
    stage: 'dev',
    deploymentMethod: 'direct',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DATABASE_URL: '${env:DATABASE_URL}',
    },
  },
  functions: {
    main: {
      handler: 'dist/main.handler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          http: {
            method: 'ANY',
            path: '{proxy+}',
          },
        },
      ],
    },
  },
  package: {
    patterns: [
      '!**',
      'node_modules/@nestjs/**',
      'package.json',
      '**/*.prisma',
      '**/libquery_engine-rhel-openssl-1.0.x.so.node',
    ],
  },
  custom: {
    region: '${opt:region, self:provider.region}',
    esbuild: {
      entryPoints: ['dist/main.js'],
      bundle: true,
      platform: 'node',
      target: ['node16'],
      exclude: [
        '@nestjs/microservices',
        '@nestjs/websockets/socket-module',
        'class-transformer',
        'class-validator',
        'cache-manager',
      ],
    },
  },
};

module.exports = serverlessConfiguration;
