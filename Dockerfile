FROM python:3.7-alpine

WORKDIR /code

COPY ./reqs.txt .
RUN apk --no-cache --update-cache --virtual .build-deps add gcc python-dev gfortran build-base \
    && pip install -r reqs.txt \
    && apk del .build-deps

COPY . .

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]