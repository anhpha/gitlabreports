FROM nginx:alpine

ADD ./ /var/www

# RUN apt-get update && \
#     apt-get install nodejs && \
#     apt-get install npm


COPY nginx.conf /etc/nginx/nginx.conf
COPY default /etc/nginx/sites-enabled/default

CMD 'nginx'
