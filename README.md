# Weatherapp

This is a partial solution to an [excercise by Eficode](https://github.com/Eficode/weatherapp). The original README is preserved at the end of this. [Demo hosted on AWS](https://weather.hirvinen.fi/)

## Running

To run both backend and frontend with default ports (8000 for the frontend, 9000 for the backend):

`[sudo] [APPID=<openweathermap.org api key>] docker-compose up`

To run in development mode (src folders mounted read-only inside containers to enable hot reload):

`[sudo] [APPID=<openweathermap.org api key>] docker-compose -f docker-compose.yml -f docker-compose.development.yml up`

package.json, and by extension node_modules is cached to speed up docker builds. To include newly installed packages add --build (or build separately):

`[sudo] [APPID=<openweathermap.org api key>] docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build`

APPID, ports etc. may also be defined in .env. See .env.example.
When running individually, the frontend should be given a full URL of the backend in the environment variable ENDPOINT in addition to defining APPID for the backend. E.g. for backend in backend directory:

`[sudo] docker build -t weatherapp_backend .`

`[sudo] docker run --rm -i -p 9000:9000 --name weatherapp_backend -t weatherapp_backend -e "APPID=<your api key>"`

And for the frontend in the frontend directory:

`[sudo] docker build -t weatherapp_frontend .`

`[sudo] docker run --rm -i -p 8000:8000 --name weatherapp_frontend -t weatherapp_frontend -e "ENDPOINT=http://localhost:9000/api"`

### With ansible

To install prerequisites and run both frontend and backend on an ubuntu host with nginx as a reverse proxy and Lets Encrypt certificates:

* Set up DNS for your target host
* set APPID, FRONTEND_HOSTNAME and BACKEND_HOSTNAME in .env
* set host in ansible/hosts
* run `ansible-playbook [-u <remote_user>] -i ansible/hosts -e 'ansible_python_interpreter=/usr/bin/python3' -e 'WEATHERAPP_ENV_FILE=../.env' ansible/site.yml`
* `-e 'ansible_python_interpreter=/usr/bin/python3'` may be omitted if python2 is installed on target

## App usage

Now, by default, app shows a forecast for a point in time that is between 2 and 5 hours from current time. Default URL for app is `http://localhost:8000/`. Current weather is still available by appending `?current` to URL, i.e. `http://localhost:8000/?current` in the default configuration.

## Tests

Branch test contains some tests, but they are limited in scope and the current frontend tests require modifying the code itself, which is undesirable.

## Original README

There was a beautiful idea of building an app that would show the upcoming weather. The developers wrote a nice backend and a frontend following the latest principles and - to be honest - bells and whistles. However, the developers did not remember to add any information about the infrastructure or even setup instructions in the source code.

Luckily we now have [docker compose](https://docs.docker.com/compose/) saving us from installing the tools on our computer, and making sure the app looks (and is) the same in development and in production. All we need is someone to add the few missing files!

## Prerequisites

* An [openweathermap](http://openweathermap.org/) API key.
* [Docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/) installed.

## Returning your solution

### Via github

* Make a copy of this repository in your own github account (do not fork unless you really want to be public).
* Create a personal repository in github.
* Make changes, commit them, and push them in your own repository.
* Send us the url where to find the code.

### Via tar-package

* Clone this repository.
* Make changes and **commit them**.
* Create a **.tgz** -package including the **.git**-directory, but excluding the **node_modules**-directories.
* Send us the archive.

## Exercises

There are a few things you must do to get the app up and running. After that there are a few things you can do to make it better.

### Mandatory

* Get yourself an API key to make queries in the [openweathermap](http://openweathermap.org/).

* Either run the app locally (using `npm i && npm start`) or move to the next step.

* Add **Dockerfile**'s in the *frontend* and the *backend* directories to run them virtually on any environment having [docker](https://www.docker.com/) installed. It should work by saying e.g. `docker build -t weatherapp_backend . && docker run --rm -i -p 9000:9000 --name weatherapp_backend -t weatherapp_backend`. If it doesn't, remember to check your api key first.

* Add a **docker-compose.yml** -file connecting the frontend and the backend, enabling running the app in a connected set of containers.

### Optional (do as many as you like)

* The application now only reports the current weather. It should probably report the forecast e.g. a few hours from now. (tip: [openweathermap api](https://openweathermap.org/forecast5))

* The developers are still keen to run the app and its pipeline on their own computers. Share the development files for the container by using volumes, and make sure the containers are started with a command enabling hot reload.

* There are [eslint](http://eslint.org/) errors. Sloppy coding it seems. Please help.

* The app currently reports the weather only for location defined in the *backend*. Shouldn't it check the browser location and use that as the reference for making a forecast? (tip: [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation))

* There are no tests. Where are the tests? (tip: [mocha](https://mochajs.org/) or [robot framework](http://robotframework.org/)) Disclaimer: this is not an easy task. If you really want to try writing robot tests, start by creating a third container that gives expected weather data, and direct the backend queries there by redefining the **MAP_ENDPOINT**.

* Set up the weather service in a free cloud hosting service, e.g. [AWS](https://aws.amazon.com/free/) or [Google Cloud](https://cloud.google.com/free/).

* Write [ansible](http://docs.ansible.com/ansible/intro.html) playbooks for installing [docker](https://www.docker.com/) and the app itself.
