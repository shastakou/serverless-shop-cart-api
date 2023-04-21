###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:16-alpine as development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node


###################
# BUILD FOR PRODUCTION
###################
FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node ./ ./
ENV NODE_ENV production
RUN npm run build
RUN npm ci --only=production && npm cache clean --force
USER node


###################
# PRODUCTION
###################
FROM node:16-alpine as production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main.js" ]