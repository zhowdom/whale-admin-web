FROM nginx:1.19.6

# Create app directory
WORKDIR /usr/src/app
# Create app directory
WORKDIR /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/templates/ /etc/nginx/templates
COPY ./dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
