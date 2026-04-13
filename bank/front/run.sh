envsubst '$EXPRESS_HOST' < /usr/share/nginx/nginx.template > /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'