# EpguFormFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.3.

## Development server
Add `127.0.0.1  local.test.gosuslugi.ru` to /etc/hosts file
First build library types `yarn lib:type:build`
Then build library `yarn lib:build` or run with watch option `yarn lib:watch`
Finally run `yarn start` for a dev server. Navigate to `http://local.test.gosuslugi.ru:4200/`. The app will automatically reload if you change any of the source files.

## Config server
Run `yarn start:config`

## Development backend server

Dependency needed - JDK 12 or greater.
Copy `fs-1.0-SNAPSHOT.jar` executable file to desired catalog, then run via command line `java -jar .\fs-1.0-SNAPSHOT.jar --server.servlet.context-path=/api`. It will launch API-server on `http://localhost:8080/api`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
