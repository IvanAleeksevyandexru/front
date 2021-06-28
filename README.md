# EpguFormFrontend

## Файл hosts

Перед началом работы обязательно добавьте `127.0.0.1  local.test.gosuslugi.ru` в /etc/hosts файл

## Установка npm модулей

```
yarn install
```

## Быстрый запуск приложения с импортом библиотек из исходников, а не из сборки

```
yarn start:fast
```

Изменения во всех файлах отслеживаются. Эта команда запускает config сервер, и запускает `ng serve` с конфигурацией fast.


`yarn start:fast` выполнит следующие команды:

```
yarn start:config
ng serve --host 0.0.0.0 --disable-host-check --hmr --configuration fast
```

## Запуск приложения с отслеживанием изменений кода в папке projects

```
yarn watch:all
```

Эта команда запускает config сервер, собирает все библиотеки (с отслеживанием изменений) и запускает приложение (ng serve) на порту 4200.
После этого откройте в браузере `http://local.test.gosuslugi.ru:4200/`

`yarn watch:all` выполнит следующие команды:

```
yarn start:config              # Запуск config сервера
yarn clean                     # удаление папки /dist и /projects/epgu-constructor-types/dist
yarn lib:type:watch            # сборка библиотеки epgu-constructor-types (с отслеиванием изменений)
yarn lib:ui-kit:watch          # сборка библиотеки epgu-constructor-ui-kit (с отслеиванием изменений)
yarn lib:children-clubs:watch  # сборка библиотеки children-clubs (с отслеиванием изменений)
yarn lib:cf:watch              # сборка библиотеки epgu-constructor (с отслеиванием изменений)
yarn start                     # запуск приложения (ng serve) на порту 4200 (с отслеживанием изменений в папке /src)
```

## Запуск приложения Epgu-документации с отслеживанием изменений кода в папке projects/epgu-constructor-docs

```
yarn lib:docs:watch
```

Команда запускает локальную версию приложения и работает в режиме HotReload по адресу http://localhost:4200/.

## Запуск приложения без отслеживания изменений кода в папке projects

```
yarn build:dev:all
```

Эта команда запускает config сервер, собирает все библиотеки (без отслеживания изменений) и запускает приложение (ng serve) на порту 4200.
После этого откройте в браузере `http://local.test.gosuslugi.ru:4200/`

`yarn build:dev:all` выполнит следующие команды:

```
yarn start:config                  # Запуск config сервера
yarn clean                         # удаление папки /dist и /projects/epgu-constructor-types/dist
yarn lib:type:build                # сборка библиотеки epgu-constructor-types (без отслеживания изменений)
yarn lib:ui-kit:build:dev          # сборка библиотеки epgu-constructor-ui-kit (без отслеживания изменений)
yarn lib:children-clubs:build:dev  # сборка библиотеки children-clubs (без отслеживания изменений)
yarn lib:build:ivy                 # сборка библиотеки epgu-constructor (без отслеживания изменений)
yarn start                         # запуск приложения (ng serve) на порту 4200 (с отслеживанием изменений в папке /src)
```

## Config server
```
yarn start:config
```

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
