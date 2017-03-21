# docker build . --tag cucumber-build
# docker run -v $(pwd):/app -it cucumber-build make
FROM alpine:3.5

WORKDIR /app

RUN apk add --no-cache --update --upgrade alpine-sdk make bash maven openjdk8 diffutils jq nodejs python py-pip ruby ruby-dev perl perl-dev wget
RUN npm install --global yarn
RUN echo "gem: --no-document" > ~/.gemrc
RUN gem install bundler io-console
RUN curl --fail -L http://cpanmin.us/ > /usr/local/bin/cpanm && chmod +x /usr/local/bin/cpanm
