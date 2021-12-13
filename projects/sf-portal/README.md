## Установка зависимостей

`yarn install`

## Локальная разработка с hot-reload

`yarn start:portal`
После открыть в браузере https://vbeta.test.gosuslugi.ru:8888/

## Локальная разработка с симлинком на @epgu/epgu-constructor (или другой локальной либой)

1. В папке либы epgu2-form-frontend сделать сборку всех либ `yarn build:prod:libs`, после всех сборок остановить инстанс эмулятора (Ctrl + C) и после этого запустить отслеживание изменений в epgu-constructor: `yarn lib:cf:watch`.
2. Далее в папке epgu2-form-frontend/dist/epgu-constructor в отдельном терминале выполнить последовательно `cp ../../.npmrc ./` и `npm link`.
3. В папке проекта sf-portal (здесь) в терминале выполнить команду: `npm link @epgu/epgu-constructor` и запустить проект как обычно через `yarn start`.
4. Если все прошло успешно папка @epgu/epgu-constructor в node_modules должна смотреть на папку epgu2-form-frontend/dist/epgu-constructor. Изменения в либе epgu-constructor сразу видны на локально запущенном портале.
5. Вернуться к исходному состоянию в проекте sf-portal можно, отлинковав либу через `npm unlink --no-save @epgu/epgu-constructor` в epgu2-form-frontend/dist/epgu-constructor и затем `npm unlink` в sf-portal.

## Продуктовая сборка

`yarn build:portal`
Продуктовый бандл будет лежать в папке `dist/`.

## Запуск юнит-тестов

`yarn test:portal`
