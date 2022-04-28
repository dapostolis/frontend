FROM registry.access.redhat.com/ubi8:8.0

LABEL version="1.0" \
description="To Do List application front-end" \
creationDate="2017-12-25" \
updatedDate="2019-08-01"

ENV NGINX_HOST=localhost:8081

RUN yum install -y --disableplugin=subscription-manager --nodocs \
  nginx nginx-mod-http-perl \
  && yum clean all

COPY nginx.conf /etc/nginx/

RUN touch /run/nginx.pid \
&& chgrp -R 0 /var/log/nginx /run/nginx.pid \
&& chmod -R g+rwx /var/log/nginx /run/nginx.pid
  
#COPY src/ /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
ADD ./build/ .

WORKDIR /etc/nginx/conf.d
ADD webapp.template .

EXPOSE 8080

USER 1001

CMD nginx -g "daemon off;"
