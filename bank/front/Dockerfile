FROM node:22-alpine AS development

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci || npm ci

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]


FROM development AS build

RUN npm run build


# For Nginx setup
FROM nginx:1.25.3-alpine

COPY --from=build /app/.nginx/nginx.conf /usr/share/nginx/nginx.template

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build .
COPY --from=build /app/run.sh .

RUN apk update && apk add bash
RUN chmod +x ./run.sh
RUN chown -R nginx:nginx .

CMD ["bash", "./run.sh"]
