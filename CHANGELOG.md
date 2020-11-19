# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.6.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.25...v0.6.1) (2020-11-19)


### Features

* Добавил валидацию согласно тикета [ref: EPGUCORE-41087] ([384f07b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/384f07bb93175e92c0b120468788c928d1aad338))
* добавил для всех InfoScr обновленный виджет соц.сетей с заблокированными кнопками [ref EPGUCORE-38796] ([9a2dbf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a2dbf2fc2c634085f9e65336df31de337ae2999))
* добавил тип modalRedirectTo и показ этой модалки в QuestionScr компонентах [ref EPGUCORE-41205] ([f26ce4c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f26ce4cac856d9e789eb37b08c5bf3a3c7dbc6be))
* добавлен функционал 'Очистить' для выпадающих списков [ref EPGUCORE-41459] ([5809364](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/58093641338f33d68b6a564bde96bc1237c2f5ae))
* реализовал сохранение детей на загран паспорте [ref EPGUCORE-41016] ([3200c20](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3200c20de6c62fb71a34d4e365b7a0e4a134b750))


### Bug Fixes

* Внесены правки по замечаниям из мерж реквеста ([11d834b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/11d834ba678e7894556fae84478dffe38c14f767))
* Внесены правки по замечаниям из мерж реквеста ([c1196cc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c1196ccd9ae33248050e84371f6798b6ce9f140f))
* Внесены правки по мерж реквесту, сокращен синтаксис компонентов оплаты, добавлен инжектор, ибран лишний код ([0f352e7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f352e79badd7a453c4b3471b745974c2d7e2515))
* исправил ошибку в epgu-constructor-temporary-registration-addr, мешающая сборке ([079a073](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/079a073ece1dc385f70ac716a9add14feabd75c0))
* Исправил условие сравнения [ref: EPGUCORE-41087] ([c73f1c2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c73f1c2a6db2c4c68e0026a4b747dd5c996dbf80))
* исправлены конфликты, замечания по код ревью [ref EPGUCORE-40605] ([cdc54ca](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cdc54cafd2fe836f6644843b3e004da4ce7905ba))
* правка eslint ошибки в info-component-modal [ref EPGUCORE-40605_SAVE_CHILDREN] ([e7ecf4b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e7ecf4b16f433f334248f8c5fd016d332d30e8cf))
* правки по замечаниям в код-ревью [ref EPGUCORE-38796] ([1e4182d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1e4182d572663a056a7bb2b73ffedbbe33f8287c))
* правки по замечаниям в код-ревью [ref EPGUCORE-40605] ([cfce2a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cfce2a2b43239c5784b22255b6e7f4483ebd0c09))
* Правки по оплате ([e85dcfc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e85dcfc65f793a630a09d48d9d6ad2e3cb01eeff))
* убрал кнопку закрытия плашки выбора детей, когда на экране только один ребенок [ref EPGUCORE-41250] ([a02414e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a02414ea0c3e6dfcc89c03d337332f184afb31a9))
* убрал неиспользуемый isShown$ ([27087d9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/27087d9c1aee113ec6ee9c6efbcb5f71f999bc67))
* удалил свойство которое неиспользуется [EPGUCORE-41348] ([be51fc0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/be51fc04390eea4a094bd35cdef2cf4642165f34))

### [0.5.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.1...v0.5.2) (2020-11-13)

### [0.5.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.26...v0.5.1) (2020-11-13)


### Features

* Создание компонента счета для оплаты пошлины ([1cd5ac6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1cd5ac68680affd0a6b56ddc46ad0ec3c8862f02))
* Создание компонента счета для оплаты пошлины через счет и правка компонента оплаты на сайте с новыми данными и оставление совместимости со старым способом ([dbac9d2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dbac9d2ba3007a2352a05e485616ce9a74ed0483))
* Создание компонента счета для оплаты пошлины через счет и правка компонента оплаты на сайте с новыми данными и оставление совместимости со старым способом ([6fa68f1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6fa68f1982ea7b0e78b56f8caf5f70001cea800d))
* Создание компонента счета для оплаты пошлины через счет и правка компонента оплаты на сайте с новыми данными и оставление совместимости со старым способом ([f8a2f95](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f8a2f95fe5f3a51a35c6de2bc77a7c9e117db734))
* Создание компонента счета для оплаты пошлины через счет и правка компонента оплаты на сайте с новыми данными и оставление совместимости со старым способом ([7ec8470](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7ec84700d02084135e8456c5635f9ff7416b4290))


### Bug Fixes

* value проверка при оплате ([f2334d1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f2334d148ca93f6144a5e70cba23e61ed586926e))
* Исправлено полечение значение поля value и верно формируется запрос по номеру начисления ([a662797](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a66279724ce6371b9eeef3a49d26b6572896a927))
* Подправлена совместимость скачивания файлов с задачей EPGUCORE-39035, чтобы везде было одинаково ([22cf223](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/22cf223e9d9ee7dccd18ef4411433cee0bb9202e))

### [0.5.25](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.24...v0.5.25) (2020-11-19)

### [0.5.24](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.23...v0.5.24) (2020-11-19)

### Bug Fixes

- Внесены правки для реализации оплаты ([4e1f938](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4e1f938527cb633aa06e86f478e6c982860d23cc))
- Внесены правки для реализации таймера ([4ba8171](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4ba81713378d9e6a0a9c12960be1b91c5d4da6d6))

### [0.5.23](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.22...v0.5.23) (2020-11-19)

### Bug Fixes

- Внесены правки для реализации таймера ([e50459e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e50459eb9b6f98de47b7e33a0e8a778f363cf87c))
- Внесены правки для реализации таймера ([c22165e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c22165e10bee244a447184314177ea987b3069bb))
- Поправлен импорт абстрктного компонента оплаты ([d29ced6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d29ced694da33b405b4d32bab6fa45afac633caf))

### [0.5.22](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.21...v0.5.22) (2020-11-19)

### Bug Fixes

- добавил конфиг явной 'прод' сборки приложения с отключенным Ivy ([b9129ca](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b9129ca44b0b3ba35b3c572644daf7c1f2f6e268))

### [0.5.21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.20...v0.5.21) (2020-11-18)

### Bug Fixes

- исправлено дефолтное значение количества дублирующих скринов [ref EPGUCORE-41578](<[55866ff](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/55866ff8f5a58090971f8e5f25fe5d52b9eca13a)>)

### [0.5.20](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.19...v0.5.20) (2020-11-18)

### [0.5.19](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.18...v0.5.19) (2020-11-18)

### [0.5.18](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.17...v0.5.18) (2020-11-18)

### [0.5.17](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.16...v0.5.17) (2020-11-18)

### [0.5.16](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.15...v0.5.16) (2020-11-18)

### [0.5.15](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.14...v0.5.15) (2020-11-18)

### [0.5.14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.13...v0.5.14) (2020-11-18)

### [0.5.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.12...v0.5.13) (2020-11-18)

### Bug Fixes

- исправлено положение и обработка ошибок для загрузчика файлов [ref EPGUCORE-41334](<[f60a41f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f60a41f4fe32be7f7d7323c2ddd8144db9f611ca)>)

### [0.5.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.11...v0.5.12) (2020-11-18)

### [0.5.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.10...v0.5.11) (2020-11-18)

### Bug Fixes

- исправлено отображение нумерации загрузки фото с камеры [ref EPGUCORE-41335](<[3fc05cc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3fc05cc7fea54453a52b459c0d87d00b4c2aa4f5)>)

### [0.5.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.9...v0.5.10) (2020-11-17)

### Bug Fixes

- исправлена высота кнопок epgu-lib [ref EPGUCORE-41030](<[dd2e74f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dd2e74f982dc288cdf7e4be6d1e54e72bcf5d018)>)

### [0.5.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.8...v0.5.9) (2020-11-17)

### Bug Fixes

- исправил дизайн на карте. Отступы, заголовок в поиске на мобильной версии [ref EPGUCORE-39249](<[aa313d6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa313d68eb88ccf713684c2686eba3e7a4cf8f3a)>)
- исправлено отображение кешированной даты [ref EPGUCORE-41261](<[5012f21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5012f21089d5a64495dd26d71b961e1415d3e5fe)>)
- поправил тест для payment-type-selector ([8183338](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8183338c3a5c8424c55e7d39ace73b688960275d))

### [0.5.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.7...v0.5.8) (2020-11-17)

### Bug Fixes

- Исправил сохранение [ref: EPGUCORE-41390](<[20439f7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/20439f7658c266aa801fc3e2818350460f7b2933)>)

### [0.5.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.6...v0.5.7) (2020-11-17)

### Bug Fixes

- удалил неиспользуемые картинки [ref EPGUCORE-41352](<[ceeb443](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ceeb4434aeeb63b8d8193e1b2b71eedce33c649d)>)

### [0.5.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.5...v0.5.6) (2020-11-17)

### Bug Fixes

- бамп epgu-lib@0.0.682 ([a2f9dfc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a2f9dfc4579ebb9b6ff0a927690e8258592b9995))

### [0.5.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.5.4...v0.5.5) (2020-11-16)

### [0.5.4](https://git.gosuslugi.local///compare/v0.4.26...v0.5.4) (2020-11-16)

### Features

- добавил текстовое сообщения[EPGUCORE-41098](<[1176dc3](https://git.gosuslugi.local///commit/1176dc351436580d43c9ccae5f2afb68ac2d779d)>)
- изменён формат данных EmployeeHistory для отправки на сервер [ref EPGUCORE-40745](<[155b75d](https://git.gosuslugi.local///commit/155b75d6c7885d9045be9cc67f201a1304847c22)>)
- Изменил логику установки минимально даты [ref: EPGUCORE-41118](<[0206abf](https://git.gosuslugi.local///commit/0206abff3ee1dfb094443572c9f268b708b3e616)>)
- Исправил стили кнопки для репитбл филдов [ref: EPGUCORE-40992](<[5121587](https://git.gosuslugi.local///commit/5121587184cee6e8f341f6fdfec70513e713ac93)>)
- исправлены тесты [ref EPGUCORE-41155](<[7674929](https://git.gosuslugi.local///commit/7674929979dd5ca2de13a166d89b7fb6af5b0724)>)

### Bug Fixes

- RegEx вынесен в переменную ([3d86832](https://git.gosuslugi.local///commit/3d86832705b216c8f1c9ba98a5e4e42807f28162))
- var заменено на const ([b4abccb](https://git.gosuslugi.local///commit/b4abccb05a471bd270f5ac295d22772e40567058))
- актуализировал цвет text-helper и labels, где необходимо [ref EPGUCORE-41122](<[704cc34](https://git.gosuslugi.local///commit/704cc34acf009243d93b732187ce2f137cbf89a9)>)
- возврат условия для docInput [ref EPGUCORE-40745](<[ed1d3f6](https://git.gosuslugi.local///commit/ed1d3f63ddd543afa3f2056de88a59383f87b7c2)>)
- Добавил подсказки для ИП [ref: EPGUCORE-41056](<[3197a0b](https://git.gosuslugi.local///commit/3197a0b0a4a899977c6888e4ea52b9a529551ea8)>)
- Исправил стили для информационного сообщения [ref: EPGUCORE-40991](<[8867478](https://git.gosuslugi.local///commit/8867478325f86e3b3f38b897bdbc2902da05945a)>)
- исправлена валидация даты DocInput ([ec5406a](https://git.gosuslugi.local///commit/ec5406a8072f8fb154279d86aff876b1e1e61141))
- исправлена валидация полей и блокирование кнопки продолжить [ref EPGUCORE-41155](<[8724ecb](https://git.gosuslugi.local///commit/8724ecbc1b51f4f6042c408523da9d589b03fcef)>)
- исправлено отображение детей в дропдауне [ref EPGUCORE-40842](<[9a6bc46](https://git.gosuslugi.local///commit/9a6bc46bf669449ac67cc1f965d5ef1ecdc24a3d)>)
- Исправлено скачивание файла ([9fd02a8](https://git.gosuslugi.local///commit/9fd02a8bcb79dc38313ba3dc313cf5b66feed7ff))
- исправлено условие [ref EPGUCORE-40745](<[017b534](https://git.gosuslugi.local///commit/017b53498c42dda218c540d40e02a3384c7515f7)>)
- перенёс сообщения на JSON[EPGUCORE-41098](<[bdc6753](https://git.gosuslugi.local///commit/bdc67536186fd96c722105662905ff289f932e6b)>)
- правки по замечаниям в код-ревью [ref EPGUCORE-41122](<[031b864](https://git.gosuslugi.local///commit/031b8648624c126aef9724f5925da6578678d808)>)
- удалён this из шаблона[ref EPGUCORE-41155](<[076ec8a](https://git.gosuslugi.local///commit/076ec8ae7132baed4282d62a56195d3104bae57b)>)
- уменьшил максимально возможное отдаление на карте[ref EPGUCORE-41316](<[8160ef3](https://git.gosuslugi.local///commit/8160ef373bfc83e866b27dfba75ef0bb194f1c73)>)
- Фикс для скачивания файлов на IOS ([003994e](https://git.gosuslugi.local///commit/003994e63201f401f4015ff5f15bb63c678044f3))

### [0.5.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.26...v0.5.3) (2020-11-16)

### Features

- added redirectToLk action to footer in the INFO screen [ref EPGUCORE-39033](<[b34b7d7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b34b7d7b95957e93b0d25a6b7fed4c9e8cbaeb8d)>)
- добавил текстовое сообщения[EPGUCORE-41098](<[1176dc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1176dc351436580d43c9ccae5f2afb68ac2d779d)>)
- изменён формат данных EmployeeHistory для отправки на сервер [ref EPGUCORE-40745](<[155b75d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/155b75d6c7885d9045be9cc67f201a1304847c22)>)
- Изменил логику установки минимально даты [ref: EPGUCORE-41118](<[0206abf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0206abff3ee1dfb094443572c9f268b708b3e616)>)
- Исправил стили кнопки для репитбл филдов [ref: EPGUCORE-40992](<[5121587](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5121587184cee6e8f341f6fdfec70513e713ac93)>)
- исправлены тесты [ref EPGUCORE-41155](<[7674929](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7674929979dd5ca2de13a166d89b7fb6af5b0724)>)
- настроена возможность перехода на выбранный ранее загс [ref EPGUCORE-38771](<[5fdd002](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fdd0025b282d971876ba3acaed571ad100c5358)>)

### Bug Fixes

- bugfix for snils cashed value in screen.service ([5a8ed96](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a8ed960a036b1887e17803409b14286809a9e49))
- RegEx вынесен в переменную ([3d86832](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3d86832705b216c8f1c9ba98a5e4e42807f28162))
- remove unneccessary cycledFields onInit logic in confirmPersonalUserAddress component [ref EPGUCORE-38025](<[d470c4d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d470c4dbb4b3cee38365a769b23db23f6bfc0473)>)
- small refactor in select-children-screen template [ref EPGUCORE-38636](<[dccf362](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dccf3624e7f99a8434aadf79246a6a6b9cfcd831)>)
- var заменено на const ([b4abccb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b4abccb05a471bd270f5ac295d22772e40567058))
- актуализировал цвет text-helper и labels, где необходимо [ref EPGUCORE-41122](<[704cc34](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/704cc34acf009243d93b732187ce2f137cbf89a9)>)
- возврат условия для docInput [ref EPGUCORE-40745](<[ed1d3f6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ed1d3f63ddd543afa3f2056de88a59383f87b7c2)>)
- Добавил подсказки для ИП [ref: EPGUCORE-41056](<[3197a0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3197a0b0a4a899977c6888e4ea52b9a529551ea8)>)
- исправил нерабочий инпут [virtualScroll]="true" для lookup ([ace9dcf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ace9dcfb8134b96a70a2c357f035b0f491723cec))
- Исправил стили для информационного сообщения [ref: EPGUCORE-40991](<[8867478](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8867478325f86e3b3f38b897bdbc2902da05945a)>)
- исправлена валидация даты DocInput ([ec5406a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ec5406a8072f8fb154279d86aff876b1e1e61141))
- исправлена валидация полей и блокирование кнопки продолжить [ref EPGUCORE-41155](<[8724ecb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8724ecbc1b51f4f6042c408523da9d589b03fcef)>)
- исправлена кривая стрелочка на кнопках ([f753a5b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f753a5bfc9a835827120dd3848f1a82b6c243900))
- исправлено отображение детей в дропдауне [ref EPGUCORE-40842](<[9a6bc46](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a6bc46bf669449ac67cc1f965d5ef1ecdc24a3d)>)
- Исправлено скачивание файла ([9fd02a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9fd02a8bcb79dc38313ba3dc313cf5b66feed7ff))
- исправлено условие [ref EPGUCORE-40745](<[017b534](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/017b53498c42dda218c540d40e02a3384c7515f7)>)
- перенёс сообщения на JSON[EPGUCORE-41098](<[bdc6753](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bdc67536186fd96c722105662905ff289f932e6b)>)
- правки по замечаниям в код-ревью [ref EPGUCORE-41122](<[031b864](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/031b8648624c126aef9724f5925da6578678d808)>)
- удалён this из шаблона[ref EPGUCORE-41155](<[076ec8a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/076ec8ae7132baed4282d62a56195d3104bae57b)>)
- уменьшил максимально возможное отдаление на карте[ref EPGUCORE-41316](<[8160ef3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8160ef373bfc83e866b27dfba75ef0bb194f1c73)>)
- Фикс для скачивания файлов на IOS ([003994e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/003994e63201f401f4015ff5f15bb63c678044f3))

### [0.2.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.12...v0.2.13) (2020-10-14)

### Bug Fixes

- added condition to show placeholder or mask as placeholder ([f18d99a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f18d99a39cc18cbf3424c0376d049b261797f904))
- make invitationUrl optional [ref EPGUCORE-38636](<[5fd9052](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fd9052ef159a8a02cecc44eea2bf5034ea5210c)>)
- make invitationUrl optional [ref EPGUCORE-38636](<[9e8998e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9e8998ebd2941ed7378142b09a59c79eba043a13)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[3b4e27f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3b4e27f7ae1fad7cc04555422ba0a64ba686c3fa)>)

### [0.2.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.11...v0.2.12) (2020-10-14)

### Bug Fixes

- invitation-error.component: fixed view of result screen [ref EPGUCORE-38516](<[8ff8fdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8ff8fddc8b3085f2b1deb832d7f165ddbdc96ea5)>)

### [0.2.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.10...v0.2.11) (2020-10-14)

### Features

- add confirmChildData type for confirm user data component [ref EPGUCORE-38920](<[26a33b4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/26a33b49c597430dc2aaf9b9ae613f2b295dc1a7)>)
- invitation-error.component update [EPGUCORE-38516](<[7b6bd62](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7b6bd6258c878338d2ca9c7ba5e7bc6f027fbb9a)>)
- новые флаги для кнопок disable и hidden [ref EPGUCORE-38882](<[18ed131](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/18ed13184dae67548cbfff8e0f892a93fc20fac0)>)

### Bug Fixes

- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[8b03a27](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8b03a275af64dd821b0ac6c8f7a00bfd2b7fd46c)>)
- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[76ffe7e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/76ffe7e777c685771c958c0fb667b3c09d1f01cf)>)
- add-new-child form generating via components-list support [ref EPGUCORE-38025](<[ef08ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef08ded4e693c381b7e959da9647e71967df5b17)>)
- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[250a59e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/250a59eac3213537696190a2cbafbeea7c666294)>)
- remove typo in confirmChildData type [ref EPGUCORE-38025](<[594e0b1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/594e0b14f5ec307933837ce2fab4f358f8f03171)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[2bf3292](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf329216efdec98d7547e61a44a73d53f0836c5)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[f48c3e7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f48c3e76e70229e4f49ffaae77bc8a7a1a95e80f)>)
- resolve child name passing to select list [ref EPGUCORE-38025](<[a6d3cfd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a6d3cfd4f66df4b2658b2898fd1c7f9148327474)>)
- resolve doubling buttons on component footer issue [ref EPGUCORE-38025](<[1f7679e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1f7679e95e1c345d536d9c80aff70e34efb78a30)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[586f8f2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/586f8f2d9c7dc13a913f7e434504155af98b6a61)>)
- update select children list processing logic [ref EPGUCORE-38025](<[46a03ce](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46a03ce910dfed8ab2d088b5c8288107271c5286)>)
- update select children list processing logic [ref EPGUCORE-38025](<[eaeb9bd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eaeb9bd0f57ed33a53029cafa6488e839208070b)>)
- update select children logic for cycled scenarios, remove redundant cycled handlers [ref EPGUCORE-38025](<[6898a94](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6898a94b16d210587aed40c9f582bc0553176265)>)
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([5e778ad](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e778ad738c5b2e877a4e123b2744613bf7f5fee))
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([b8f75b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b8f75b8b9743a0fd72108d795f2ba4a274d423c1))
- исправил мерж пресета и кэша в случае когда preset просто строка, а не JSON ([5eaada8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5eaada8ab279ffb69e687ae0b8761ad3c780de23))
- исправил фильтрацию для восстановление данных. ([9c6f6c0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c6f6c05d700d422653fb8b93982a9b7dd05fe20))

### [0.2.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.9...v0.2.10) (2020-10-13)

### Bug Fixes

- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[15e4e72](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e4e72773b937a3d590f2746f8fd2bb9eb217ca)>)
- new inline radio buttons on mobile ([c45c34c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c45c34cc457cea7ffaeefba7a7ea1a9c80b418e3))
- добавил поддержку модальных окон в subheader ([7015755](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/701575591e40e22dc97c8544dab8c177e8bad45d))

### [0.2.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.8...v0.2.9) (2020-10-13)

### [0.2.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.7...v0.2.8) (2020-10-12)

### Bug Fixes

- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[b6a4336](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b6a43361ded61b75e283496991f53071b1abe3a7)>)
- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[3fa4229](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3fa4229d463327dddba07ad9f21a665ba63d0696)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[0c60e0d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0c60e0d50969e85dd7d63590fd9db1a621f53422)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[3235848](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3235848f660345d6b5d5789b9220af080e1ad97e)>)

### [0.2.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.6...v0.2.7) (2020-10-12)

### Features

- added payCode get from JSON ([1ebffeb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1ebffeb3edfe96cee6862c1f7eb5a8213b587e76))

### Bug Fixes

- update auto version bump for lib bundle ([15e9371](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e9371e644d0fc22fcefb284cea7b4fb9c3cd2d))
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[5006009](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5006009d8536b0abbdb8346544c5e26b3d65e7d3)>)
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[f4cd0ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f4cd0ab2a4f4fd82e3458d54f30e7b44f9475e7a)>)
- исправил затирание preset value из cachedAnswers [ref EPGUCORE-38623](<[faee444](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/faee4446a0b72e1be068cec302646765a0a8947c)>)
- определили функцию которая решает какие данные нужно брать из кеша. ([414cf0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/414cf0b2715cc4fe71252f54899d4767a32ab873))

### [0.2.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.5...v0.2.6) (2020-10-12)

### Bug Fixes

- add static assets for json-scenarios [ref EPGUCORE-38123](<[11e22e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/11e22e89e32b89f8931f56a03cdbbb447fba2016)>)

### [0.2.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.4...v0.2.5) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38643](<[0544f7d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0544f7d23a814b1c0eb355a7c92281299e97fd6a)>)

### Bug Fixes

- refactoring ([132b870](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/132b8706f44d2b7802125a3ae5757771bbbadc38))
- refactoring ([55b90b3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/55b90b32ad736cbe6040296355fb62c3ee05a928))
- исправил "назад" для MapService [ref EPGUCORE-38644](<[eb22099](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eb22099c3601b3788192c9a8b678661fdeddccad)>)
- Исправил патчинг формы за 10 лет ([496e886](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/496e886abed6d26a037491f3d6bf81ae69bc5f52))
- исправл возвращение обратна на страницу персональных данных. ([695bc21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/695bc214cab870051182162e0f642781ac381d4b))

### [0.2.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.4) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))

### [0.2.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.32...v0.2.1) (2020-10-09)

### Bug Fixes

- bump epgu-lib@0.0.589, remove social-share till 25.10 [ref EPGUCORE-36456](<[4b291d0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4b291d0c138a1e6cd9ab717712604fe39a658e1a)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- New calc function ([0f87b2f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f87b2f812305fb137af70675c0471efebeecab9))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)

### [0.5.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.26...v0.5.2) (2020-11-16)

### Features

- added redirectToLk action to footer in the INFO screen [ref EPGUCORE-39033](<[b34b7d7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b34b7d7b95957e93b0d25a6b7fed4c9e8cbaeb8d)>)
- добавил текстовое сообщения[EPGUCORE-41098](<[1176dc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1176dc351436580d43c9ccae5f2afb68ac2d779d)>)
- изменён формат данных EmployeeHistory для отправки на сервер [ref EPGUCORE-40745](<[155b75d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/155b75d6c7885d9045be9cc67f201a1304847c22)>)
- Изменил логику установки минимально даты [ref: EPGUCORE-41118](<[0206abf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0206abff3ee1dfb094443572c9f268b708b3e616)>)
- Исправил стили кнопки для репитбл филдов [ref: EPGUCORE-40992](<[5121587](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5121587184cee6e8f341f6fdfec70513e713ac93)>)
- настроена возможность перехода на выбранный ранее загс [ref EPGUCORE-38771](<[5fdd002](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fdd0025b282d971876ba3acaed571ad100c5358)>)

### Bug Fixes

- bugfix for snils cashed value in screen.service ([5a8ed96](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a8ed960a036b1887e17803409b14286809a9e49))
- RegEx вынесен в переменную ([3d86832](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3d86832705b216c8f1c9ba98a5e4e42807f28162))
- remove unneccessary cycledFields onInit logic in confirmPersonalUserAddress component [ref EPGUCORE-38025](<[d470c4d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d470c4dbb4b3cee38365a769b23db23f6bfc0473)>)
- small refactor in select-children-screen template [ref EPGUCORE-38636](<[dccf362](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dccf3624e7f99a8434aadf79246a6a6b9cfcd831)>)
- var заменено на const ([b4abccb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b4abccb05a471bd270f5ac295d22772e40567058))
- возврат условия для docInput [ref EPGUCORE-40745](<[ed1d3f6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ed1d3f63ddd543afa3f2056de88a59383f87b7c2)>)
- Добавил подсказки для ИП [ref: EPGUCORE-41056](<[3197a0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3197a0b0a4a899977c6888e4ea52b9a529551ea8)>)
- исправил нерабочий инпут [virtualScroll]="true" для lookup ([ace9dcf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ace9dcfb8134b96a70a2c357f035b0f491723cec))
- Исправил стили для информационного сообщения [ref: EPGUCORE-40991](<[8867478](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8867478325f86e3b3f38b897bdbc2902da05945a)>)
- исправлена валидация даты DocInput ([ec5406a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ec5406a8072f8fb154279d86aff876b1e1e61141))
- исправлена кривая стрелочка на кнопках ([f753a5b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f753a5bfc9a835827120dd3848f1a82b6c243900))
- исправлено отображение детей в дропдауне [ref EPGUCORE-40842](<[9a6bc46](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a6bc46bf669449ac67cc1f965d5ef1ecdc24a3d)>)
- Исправлено скачивание файла ([9fd02a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9fd02a8bcb79dc38313ba3dc313cf5b66feed7ff))
- исправлено условие [ref EPGUCORE-40745](<[017b534](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/017b53498c42dda218c540d40e02a3384c7515f7)>)
- перенёс сообщения на JSON[EPGUCORE-41098](<[bdc6753](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bdc67536186fd96c722105662905ff289f932e6b)>)
- уменьшил максимально возможное отдаление на карте[ref EPGUCORE-41316](<[8160ef3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8160ef373bfc83e866b27dfba75ef0bb194f1c73)>)
- Фикс для скачивания файлов на IOS ([003994e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/003994e63201f401f4015ff5f15bb63c678044f3))

### [0.2.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.12...v0.2.13) (2020-10-14)

### Bug Fixes

- added condition to show placeholder or mask as placeholder ([f18d99a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f18d99a39cc18cbf3424c0376d049b261797f904))
- make invitationUrl optional [ref EPGUCORE-38636](<[5fd9052](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fd9052ef159a8a02cecc44eea2bf5034ea5210c)>)
- make invitationUrl optional [ref EPGUCORE-38636](<[9e8998e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9e8998ebd2941ed7378142b09a59c79eba043a13)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[3b4e27f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3b4e27f7ae1fad7cc04555422ba0a64ba686c3fa)>)

### [0.2.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.11...v0.2.12) (2020-10-14)

### Bug Fixes

- invitation-error.component: fixed view of result screen [ref EPGUCORE-38516](<[8ff8fdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8ff8fddc8b3085f2b1deb832d7f165ddbdc96ea5)>)

### [0.2.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.10...v0.2.11) (2020-10-14)

### Features

- add confirmChildData type for confirm user data component [ref EPGUCORE-38920](<[26a33b4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/26a33b49c597430dc2aaf9b9ae613f2b295dc1a7)>)
- invitation-error.component update [EPGUCORE-38516](<[7b6bd62](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7b6bd6258c878338d2ca9c7ba5e7bc6f027fbb9a)>)
- новые флаги для кнопок disable и hidden [ref EPGUCORE-38882](<[18ed131](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/18ed13184dae67548cbfff8e0f892a93fc20fac0)>)

### Bug Fixes

- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[8b03a27](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8b03a275af64dd821b0ac6c8f7a00bfd2b7fd46c)>)
- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[76ffe7e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/76ffe7e777c685771c958c0fb667b3c09d1f01cf)>)
- add-new-child form generating via components-list support [ref EPGUCORE-38025](<[ef08ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef08ded4e693c381b7e959da9647e71967df5b17)>)
- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[250a59e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/250a59eac3213537696190a2cbafbeea7c666294)>)
- remove typo in confirmChildData type [ref EPGUCORE-38025](<[594e0b1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/594e0b14f5ec307933837ce2fab4f358f8f03171)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[2bf3292](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf329216efdec98d7547e61a44a73d53f0836c5)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[f48c3e7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f48c3e76e70229e4f49ffaae77bc8a7a1a95e80f)>)
- resolve child name passing to select list [ref EPGUCORE-38025](<[a6d3cfd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a6d3cfd4f66df4b2658b2898fd1c7f9148327474)>)
- resolve doubling buttons on component footer issue [ref EPGUCORE-38025](<[1f7679e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1f7679e95e1c345d536d9c80aff70e34efb78a30)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[586f8f2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/586f8f2d9c7dc13a913f7e434504155af98b6a61)>)
- update select children list processing logic [ref EPGUCORE-38025](<[46a03ce](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46a03ce910dfed8ab2d088b5c8288107271c5286)>)
- update select children list processing logic [ref EPGUCORE-38025](<[eaeb9bd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eaeb9bd0f57ed33a53029cafa6488e839208070b)>)
- update select children logic for cycled scenarios, remove redundant cycled handlers [ref EPGUCORE-38025](<[6898a94](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6898a94b16d210587aed40c9f582bc0553176265)>)
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([5e778ad](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e778ad738c5b2e877a4e123b2744613bf7f5fee))
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([b8f75b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b8f75b8b9743a0fd72108d795f2ba4a274d423c1))
- исправил мерж пресета и кэша в случае когда preset просто строка, а не JSON ([5eaada8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5eaada8ab279ffb69e687ae0b8761ad3c780de23))
- исправил фильтрацию для восстановление данных. ([9c6f6c0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c6f6c05d700d422653fb8b93982a9b7dd05fe20))

### [0.2.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.9...v0.2.10) (2020-10-13)

### Bug Fixes

- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[15e4e72](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e4e72773b937a3d590f2746f8fd2bb9eb217ca)>)
- new inline radio buttons on mobile ([c45c34c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c45c34cc457cea7ffaeefba7a7ea1a9c80b418e3))
- добавил поддержку модальных окон в subheader ([7015755](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/701575591e40e22dc97c8544dab8c177e8bad45d))

### [0.2.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.8...v0.2.9) (2020-10-13)

### [0.2.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.7...v0.2.8) (2020-10-12)

### Bug Fixes

- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[b6a4336](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b6a43361ded61b75e283496991f53071b1abe3a7)>)
- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[3fa4229](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3fa4229d463327dddba07ad9f21a665ba63d0696)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[0c60e0d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0c60e0d50969e85dd7d63590fd9db1a621f53422)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[3235848](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3235848f660345d6b5d5789b9220af080e1ad97e)>)

### [0.2.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.6...v0.2.7) (2020-10-12)

### Features

- added payCode get from JSON ([1ebffeb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1ebffeb3edfe96cee6862c1f7eb5a8213b587e76))

### Bug Fixes

- update auto version bump for lib bundle ([15e9371](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e9371e644d0fc22fcefb284cea7b4fb9c3cd2d))
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[5006009](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5006009d8536b0abbdb8346544c5e26b3d65e7d3)>)
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[f4cd0ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f4cd0ab2a4f4fd82e3458d54f30e7b44f9475e7a)>)
- исправил затирание preset value из cachedAnswers [ref EPGUCORE-38623](<[faee444](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/faee4446a0b72e1be068cec302646765a0a8947c)>)
- определили функцию которая решает какие данные нужно брать из кеша. ([414cf0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/414cf0b2715cc4fe71252f54899d4767a32ab873))

### [0.2.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.5...v0.2.6) (2020-10-12)

### Bug Fixes

- add static assets for json-scenarios [ref EPGUCORE-38123](<[11e22e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/11e22e89e32b89f8931f56a03cdbbb447fba2016)>)

### [0.2.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.4...v0.2.5) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38643](<[0544f7d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0544f7d23a814b1c0eb355a7c92281299e97fd6a)>)

### Bug Fixes

- refactoring ([132b870](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/132b8706f44d2b7802125a3ae5757771bbbadc38))
- refactoring ([55b90b3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/55b90b32ad736cbe6040296355fb62c3ee05a928))
- исправил "назад" для MapService [ref EPGUCORE-38644](<[eb22099](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eb22099c3601b3788192c9a8b678661fdeddccad)>)
- Исправил патчинг формы за 10 лет ([496e886](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/496e886abed6d26a037491f3d6bf81ae69bc5f52))
- исправл возвращение обратна на страницу персональных данных. ([695bc21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/695bc214cab870051182162e0f642781ac381d4b))

### [0.2.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.4) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))

### [0.2.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.32...v0.2.1) (2020-10-09)

### Bug Fixes

- bump epgu-lib@0.0.589, remove social-share till 25.10 [ref EPGUCORE-36456](<[4b291d0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4b291d0c138a1e6cd9ab717712604fe39a658e1a)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)

### [0.5.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.26...v0.5.1) (2020-11-16)

### Features

- added redirectToLk action to footer in the INFO screen [ref EPGUCORE-39033](<[b34b7d7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b34b7d7b95957e93b0d25a6b7fed4c9e8cbaeb8d)>)
- добавил текстовое сообщения[EPGUCORE-41098](<[1176dc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1176dc351436580d43c9ccae5f2afb68ac2d779d)>)
- изменён формат данных EmployeeHistory для отправки на сервер [ref EPGUCORE-40745](<[155b75d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/155b75d6c7885d9045be9cc67f201a1304847c22)>)
- Изменил логику установки минимально даты [ref: EPGUCORE-41118](<[0206abf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0206abff3ee1dfb094443572c9f268b708b3e616)>)
- Исправил стили кнопки для репитбл филдов [ref: EPGUCORE-40992](<[5121587](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5121587184cee6e8f341f6fdfec70513e713ac93)>)
- настроена возможность перехода на выбранный ранее загс [ref EPGUCORE-38771](<[5fdd002](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fdd0025b282d971876ba3acaed571ad100c5358)>)

### Bug Fixes

- bugfix for snils cashed value in screen.service ([5a8ed96](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a8ed960a036b1887e17803409b14286809a9e49))
- RegEx вынесен в переменную ([3d86832](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3d86832705b216c8f1c9ba98a5e4e42807f28162))
- remove unneccessary cycledFields onInit logic in confirmPersonalUserAddress component [ref EPGUCORE-38025](<[d470c4d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d470c4dbb4b3cee38365a769b23db23f6bfc0473)>)
- small refactor in select-children-screen template [ref EPGUCORE-38636](<[dccf362](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dccf3624e7f99a8434aadf79246a6a6b9cfcd831)>)
- var заменено на const ([b4abccb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b4abccb05a471bd270f5ac295d22772e40567058))
- возврат условия для docInput [ref EPGUCORE-40745](<[ed1d3f6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ed1d3f63ddd543afa3f2056de88a59383f87b7c2)>)
- Добавил подсказки для ИП [ref: EPGUCORE-41056](<[3197a0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3197a0b0a4a899977c6888e4ea52b9a529551ea8)>)
- исправил нерабочий инпут [virtualScroll]="true" для lookup ([ace9dcf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ace9dcfb8134b96a70a2c357f035b0f491723cec))
- Исправил стили для информационного сообщения [ref: EPGUCORE-40991](<[8867478](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8867478325f86e3b3f38b897bdbc2902da05945a)>)
- исправлена валидация даты DocInput ([ec5406a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ec5406a8072f8fb154279d86aff876b1e1e61141))
- исправлена кривая стрелочка на кнопках ([f753a5b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f753a5bfc9a835827120dd3848f1a82b6c243900))
- исправлено отображение детей в дропдауне [ref EPGUCORE-40842](<[9a6bc46](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a6bc46bf669449ac67cc1f965d5ef1ecdc24a3d)>)
- Исправлено скачивание файла ([9fd02a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9fd02a8bcb79dc38313ba3dc313cf5b66feed7ff))
- исправлено условие [ref EPGUCORE-40745](<[017b534](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/017b53498c42dda218c540d40e02a3384c7515f7)>)
- перенёс сообщения на JSON[EPGUCORE-41098](<[bdc6753](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bdc67536186fd96c722105662905ff289f932e6b)>)
- уменьшил максимально возможное отдаление на карте[ref EPGUCORE-41316](<[8160ef3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8160ef373bfc83e866b27dfba75ef0bb194f1c73)>)
- Фикс для скачивания файлов на IOS ([003994e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/003994e63201f401f4015ff5f15bb63c678044f3))

### [0.2.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.12...v0.2.13) (2020-10-14)

### Bug Fixes

- added condition to show placeholder or mask as placeholder ([f18d99a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f18d99a39cc18cbf3424c0376d049b261797f904))
- make invitationUrl optional [ref EPGUCORE-38636](<[5fd9052](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fd9052ef159a8a02cecc44eea2bf5034ea5210c)>)
- make invitationUrl optional [ref EPGUCORE-38636](<[9e8998e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9e8998ebd2941ed7378142b09a59c79eba043a13)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[3b4e27f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3b4e27f7ae1fad7cc04555422ba0a64ba686c3fa)>)

### [0.2.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.11...v0.2.12) (2020-10-14)

### Bug Fixes

- invitation-error.component: fixed view of result screen [ref EPGUCORE-38516](<[8ff8fdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8ff8fddc8b3085f2b1deb832d7f165ddbdc96ea5)>)

### [0.2.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.10...v0.2.11) (2020-10-14)

### Features

- add confirmChildData type for confirm user data component [ref EPGUCORE-38920](<[26a33b4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/26a33b49c597430dc2aaf9b9ae613f2b295dc1a7)>)
- invitation-error.component update [EPGUCORE-38516](<[7b6bd62](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7b6bd6258c878338d2ca9c7ba5e7bc6f027fbb9a)>)
- новые флаги для кнопок disable и hidden [ref EPGUCORE-38882](<[18ed131](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/18ed13184dae67548cbfff8e0f892a93fc20fac0)>)

### Bug Fixes

- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[8b03a27](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8b03a275af64dd821b0ac6c8f7a00bfd2b7fd46c)>)
- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[76ffe7e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/76ffe7e777c685771c958c0fb667b3c09d1f01cf)>)
- add-new-child form generating via components-list support [ref EPGUCORE-38025](<[ef08ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef08ded4e693c381b7e959da9647e71967df5b17)>)
- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[250a59e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/250a59eac3213537696190a2cbafbeea7c666294)>)
- remove typo in confirmChildData type [ref EPGUCORE-38025](<[594e0b1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/594e0b14f5ec307933837ce2fab4f358f8f03171)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[2bf3292](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf329216efdec98d7547e61a44a73d53f0836c5)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[f48c3e7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f48c3e76e70229e4f49ffaae77bc8a7a1a95e80f)>)
- resolve child name passing to select list [ref EPGUCORE-38025](<[a6d3cfd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a6d3cfd4f66df4b2658b2898fd1c7f9148327474)>)
- resolve doubling buttons on component footer issue [ref EPGUCORE-38025](<[1f7679e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1f7679e95e1c345d536d9c80aff70e34efb78a30)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[586f8f2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/586f8f2d9c7dc13a913f7e434504155af98b6a61)>)
- update select children list processing logic [ref EPGUCORE-38025](<[46a03ce](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46a03ce910dfed8ab2d088b5c8288107271c5286)>)
- update select children list processing logic [ref EPGUCORE-38025](<[eaeb9bd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eaeb9bd0f57ed33a53029cafa6488e839208070b)>)
- update select children logic for cycled scenarios, remove redundant cycled handlers [ref EPGUCORE-38025](<[6898a94](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6898a94b16d210587aed40c9f582bc0553176265)>)
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([5e778ad](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e778ad738c5b2e877a4e123b2744613bf7f5fee))
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([b8f75b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b8f75b8b9743a0fd72108d795f2ba4a274d423c1))
- исправил мерж пресета и кэша в случае когда preset просто строка, а не JSON ([5eaada8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5eaada8ab279ffb69e687ae0b8761ad3c780de23))
- исправил фильтрацию для восстановление данных. ([9c6f6c0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c6f6c05d700d422653fb8b93982a9b7dd05fe20))

### [0.2.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.9...v0.2.10) (2020-10-13)

### Bug Fixes

- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[15e4e72](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e4e72773b937a3d590f2746f8fd2bb9eb217ca)>)
- new inline radio buttons on mobile ([c45c34c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c45c34cc457cea7ffaeefba7a7ea1a9c80b418e3))
- добавил поддержку модальных окон в subheader ([7015755](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/701575591e40e22dc97c8544dab8c177e8bad45d))

### [0.2.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.8...v0.2.9) (2020-10-13)

### [0.2.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.7...v0.2.8) (2020-10-12)

### Bug Fixes

- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[b6a4336](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b6a43361ded61b75e283496991f53071b1abe3a7)>)
- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[3fa4229](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3fa4229d463327dddba07ad9f21a665ba63d0696)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[0c60e0d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0c60e0d50969e85dd7d63590fd9db1a621f53422)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[3235848](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3235848f660345d6b5d5789b9220af080e1ad97e)>)

### [0.2.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.6...v0.2.7) (2020-10-12)

### Features

- added payCode get from JSON ([1ebffeb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1ebffeb3edfe96cee6862c1f7eb5a8213b587e76))

### Bug Fixes

- update auto version bump for lib bundle ([15e9371](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e9371e644d0fc22fcefb284cea7b4fb9c3cd2d))
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[5006009](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5006009d8536b0abbdb8346544c5e26b3d65e7d3)>)
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[f4cd0ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f4cd0ab2a4f4fd82e3458d54f30e7b44f9475e7a)>)
- исправил затирание preset value из cachedAnswers [ref EPGUCORE-38623](<[faee444](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/faee4446a0b72e1be068cec302646765a0a8947c)>)
- определили функцию которая решает какие данные нужно брать из кеша. ([414cf0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/414cf0b2715cc4fe71252f54899d4767a32ab873))

### [0.2.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.5...v0.2.6) (2020-10-12)

### Bug Fixes

- add static assets for json-scenarios [ref EPGUCORE-38123](<[11e22e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/11e22e89e32b89f8931f56a03cdbbb447fba2016)>)

### [0.2.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.4...v0.2.5) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38643](<[0544f7d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0544f7d23a814b1c0eb355a7c92281299e97fd6a)>)

### Bug Fixes

- refactoring ([132b870](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/132b8706f44d2b7802125a3ae5757771bbbadc38))
- refactoring ([55b90b3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/55b90b32ad736cbe6040296355fb62c3ee05a928))
- исправил "назад" для MapService [ref EPGUCORE-38644](<[eb22099](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eb22099c3601b3788192c9a8b678661fdeddccad)>)
- Исправил патчинг формы за 10 лет ([496e886](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/496e886abed6d26a037491f3d6bf81ae69bc5f52))
- исправл возвращение обратна на страницу персональных данных. ([695bc21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/695bc214cab870051182162e0f642781ac381d4b))

### [0.2.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.4) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))

### [0.2.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.32...v0.2.1) (2020-10-09)

### Bug Fixes

- bump epgu-lib@0.0.589, remove social-share till 25.10 [ref EPGUCORE-36456](<[4b291d0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4b291d0c138a1e6cd9ab717712604fe39a658e1a)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- New calc function ([0f87b2f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f87b2f812305fb137af70675c0471efebeecab9))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)

### [0.4.26](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.25...v0.4.26) (2020-11-13)

### [0.4.25](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.24...v0.4.25) (2020-11-12)

### [0.4.24](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.31...v0.4.24) (2020-11-11)

### Features

- добавил автовыбор ближайшего объекта к центру карты [ref EPGUCORE-40915](<[a3d61b7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a3d61b78b5a6eb48cc3c1556c71c75246db9bfd5)>)

### Bug Fixes

- блокировка кнопки на экране с адресом [EPGUCORE-40737]; ([048d465](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/048d46551074f31c9d2adbd6d039598b17b1d3cc))
- Исправил загрузку файлов [ref: EPGUCORE-40900](<[fb8d86b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/fb8d86b711c93f122ac03c2ff583e728412ad715)>)
- исправлен отсут для кнопки [ref EPGUCORE-40914](<[02fabc5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/02fabc5452a1f07115eac83be764ad5690996017)>)
- исправлена регулярка, срезающая букву "ё" в начале [ref EPGUCORE-39251](<[5390999](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/53909991bd9e46d5d9402b18ad273b2f325de0e7)>)
- исправлено обновление информации о загруженном фото [ref EPGUCORE-41031](<[9e13b66](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9e13b6623cab90e170f4cb825861a8fb14b38f9f)>)
- отмена использование кешированных данных для смены email и телефона. ([cf10692](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cf10692fb25433f4831de04425ab612c8d4d8838))

### [0.4.23](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.22...v0.4.23) (2020-11-10)

### Bug Fixes

- добавлен формат TIFF как исключение из сжатия изображений [ref EPGUCORE-40821](<[5d3487f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d3487f015ee7e1d21ab201721ac39af5cea326e)>)
- изменена валидация согласно требованию дизайна [ref EPGUCORE-40776](<[9b99a01](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b99a011649f6ec69c5e17fcfa5b8960541413a0)>)
- Изменил механизм валидации дат [ref: EPGUCORE-40571](<[d884ade](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d884ade4177180632b2ff948f89fe505635db210)>)
- исправил инвертирование даты при возврате назад [EPGUCORE-40838](<[9a6a889](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a6a889c22af6e054f25c6eaac343718e1be4571)>)
- исправил формат даты [EPGUCORE-40838](<[5d35fe6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d35fe648af206d958a92edb238ca82a622f63a8)>)
- исправлено отображение ошибки required filed после первой потери фокуса с поля [ref EPGUCORE-40916](<[88d1dbb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/88d1dbbda4f2460f38af37a0c829f11a5cbb896f)>)
- обработал случай когда нет адреса. [EPGUCORE-40789][epgucore-40790] ([f447288](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f447288e0dcee1872a72bffe48378b0a828b8d56))
- поправил типы [ref: EPGUCORE-40571](<[0f27184](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f271846ff1fe0af1cfc9f55e879a69bdb03967d)>)

### [0.4.22](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.21...v0.4.22) (2020-11-09)

### Bug Fixes

- добавил скрытие ошибок валидации с бэка после изменения значения в полях для компонента "адрес для временной регистрации" [ref EPGUCORE-37184](<[4e2d798](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4e2d798341a61306454a04b4d61f0c50a38b0d50)>)
- исправлена блокировка перехода на следующий скрин для загрузки файлов [ref EPGUCORE-40730](<[c8965d3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c8965d3b7eb785173b9bb9735354ddcc433daa45)>)
- исправлена вёрстка компонента фото для ipad mini [ref EPGUCORE-40580](<[46cf118](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46cf11882a182c110c72f384ee8cee65ef38bd1b)>)

### [0.4.21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.20...v0.4.21) (2020-11-08)

### Bug Fixes

- исправил ошибку при загрузке фото, файл загружается успешно но не возвращаются данные. ([6b3b5d5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6b3b5d5dbb44c5e7e27dd645ea60719a400e7720))

### [0.4.20](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.19...v0.4.20) (2020-11-08)

### [0.4.19](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.18...v0.4.19) (2020-11-08)

### Bug Fixes

- исправлено прикрепление фото [ref EPGUCORE-40743](<[64d83a1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/64d83a1ad14643cf35dac29043206a80cc4844fc)>)

### [0.4.18](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.17...v0.4.18) (2020-11-07)

### [0.4.17](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.16...v0.4.17) (2020-11-06)

### Bug Fixes

- Некорректное отображение экрана Заявление отправлено [EPGUCORE-40644](<[51cac25](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/51cac25c792bc0154b2bafe898b86ca9ba6a9032)>)
- обраотка успешной загрузки фото без ответа: Комаров ([2d81b2e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2d81b2ee0de3337d6616172c61ce439f6291ccff))

### [0.4.16](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.15...v0.4.16) (2020-11-06)

### Bug Fixes

- добавил блокировку если в dropdown(-е) один элемент.[EPGUCORE-40660](<[b9dc029](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b9dc0299fb85797a6cb07fbac1848558d148a868)>)
- добавил отступ для элементро экрана проверки адреса.[EPGUCORE-40638](<[1386a14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1386a14d30827cc9f287efc5b9ef4eac9571eab9)>)
- изменено название переменной ([6c220f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6c220f449124ff37c7af5d36931065e56bc7da88))
- испаравлено сохранение данных на стр. персональны данных ([9483d59](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9483d59d1dc71f089717ae478c5406a3527d2593))
- исправил валидации на загрузке файлов [ref EPGUCORE-40475](<[e636ae3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e636ae37e4b6ae1efcdf0275019e223c1afafd54)>)
- исправил слипание кнопок находящиеся внизу [EPGUCORE-40638](<[5afc9bb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5afc9bbad09faeb2012a18005203861945929369)>)
- исправлена генерация названия прикреплённого фото [ref EPGUCORE-40654](<[2dfa461](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2dfa46170866f42cc96db5f10f76aa4674035c51)>)
- исправления представление текста для firefox ([bee9bfa](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bee9bfabbc07751bd3264ba55342bb022b8cb6ae))
- исправлено загрузка битых фото, ограничение файлов до 5 мб ([aede393](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aede3931cfc2443da1c510a39bf805faa5e5b64e))
- исправленя по стилям ([3e149cc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3e149cc6aad2eae47bdaa2e0a72e3fec96b1fc9f))
- исправленя по стилям ([99bb418](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/99bb418ce608de44c2e07ea1ddbdd58bc8ea9da3))
- Не верно работает рег. выражение для компонента Кем выдано [EPGUCORE-40630](<[b42910a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b42910a2f47db01c00185c9b27656519825b997d)>)
- Обработка ошибки 404 при падении бронирования таймслотов [EPGUCORE-40431](<[c6f4613](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c6f4613e4bd8e46391732bb2d6733412845d2186)>)
- переименован метод ([f2280ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f2280eae58e9fc9436f960c350d0e135db530e62))
- увеличил зону для клика по кнопкам. Исправил button на библиотечный lib-button [ref EPGUCORE-40434](<[3389fc1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3389fc17cc81ec36714fc30af678985f2aae28fe)>)

### [0.4.15](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.14...v0.4.15) (2020-11-05)

### [0.4.14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.13...v0.4.14) (2020-11-05)

### Bug Fixes

- исправлен показ компоента MVD [EPGUCORE-40365](<[22af4ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/22af4ab573f223551b0fd39dee2f50eaabd1b624)>)
- исправления ошибки с количеством подгружаемых фалов. ([ab61c68](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ab61c682fb3d6472c09b62a55474cfcb8deb0b9f))
- исправления после merge ([1d742a6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1d742a6d4cf5e3ec6a9c9ea12a6568c1679c7f0e))
- обновил header для обёртки [EPGUCORE-40231](<[37273b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/37273b8dd7c8ceb788d4d979965655d26c9261d3)>)
- удалил статичный текст валидации [ref EPGUCORE-40432](<[dfdcfee](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dfdcfeebb8175319b36e4d1efce350f942f63e22)>)

### [0.4.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.12...v0.4.13) (2020-11-05)

### Features

- зависимость периода выбранных дат календарей [ref EPGUCORE-40403](<[e075837](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e07583722e0ac593d7278486273865c19b2417c0)>)
- Компонент Укажите реквизиты паспорта привести в соответствие с дизайн-контролем [ref: EPGUCORE-40468](<[031a27a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/031a27ad5853e63e5b95c93e2c6e6fadca54bc30)>)
- перевёл компоненты на новый формат ([1de1211](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1de1211f58c7fe04cfa6a15402c80d1a5732641a))

### Bug Fixes

- добавил префиксы для кроссбраузерности; ([d87f03d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d87f03d22418a53d7d6c11b8604a40136a137568))
- исправлен lint [ref EPGUCORE-40346](<[5c52891](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5c5289188e7187293a4a12513de8e29f9df147d1)>)
- исправлена логика отображения кнопки фото [ref EPGUCORE-40433](<[b50c019](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b50c01923eb255820a375ce04113c7e38dd16f18)>)
- исправлено ограничение по количеству загрузки файлов, по общему размеру файлов [ref EPGUCORE-40346](<[d515201](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d51520140b5227d9646e568461193942e142176f)>)
- исправлено оторажение и блокировка кнопки фото [ref EPGUCORE-40366](<[e2f689c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e2f689c9a9c08042129ccca60d3372317942b8aa)>)
- исправлено состояние блокирование кнопки для компонента загрузки файлов [ref EPGUCORE-39301](<[27a9355](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/27a9355c8aa39d731c6fec31463bae5c52b549a1)>)
- стоимость позволяет вводить только числа [ref EPGUCORE-40405](<[534b773](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/534b7732621fbfa5bc42956b018f509eaaaf340a)>)

### [0.4.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.11...v0.4.12) (2020-11-02)

### Bug Fixes

- добавлены классы для цветов текста, используемых в json-сценариях [ref EPGUCORE-40312](<[a5ae46d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5ae46db085a69861b5e0243a13a6d3d6b6a4800)>)

### [0.4.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.26...v0.4.11) (2020-11-02)

### Bug Fixes

- добавлен свитч кейс для docInput ([17dd775](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/17dd775000785036fe805f1209a404f52ed55d33))
- добавлены классы для цветов текста, используемых в json-сценариях [ref EPGUCORE-40312](<[5b045ec](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5b045ec809ba24f084719830c5971dbc5819b50a)>)
- исправлена работа кнопки "сделать фото" [ref EPGUCORE-39301](<[3052695](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/30526952b886c4738e8880257823f0d57158e176)>)

### [0.4.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.24...v0.4.10) (2020-10-30)

### Bug Fixes

- added interfaces [ref EPGUCORE-39803](<[1503f5e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1503f5e2960002e12e0e3b5e0f5cb298d9c91924)>)
- fixed component export [ref EPGUCORE-39803](<[cdb3ac9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cdb3ac9834446bd292760ae211396e6517cef4df)>)
- вернул на место иконку warn.svg в компоненте confirm-email [ref EPGUCORE-40183-40183](<[070a3e6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/070a3e6ca228b6ffaf4f8e03b24fa02a368cc896)>)
- добалена глубокая проверка файла на тип изображения + добавлены дизейбл стили для кнопок компонента фото [ref EPGUCORE-40198](<[4758da2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4758da238fb99d22f5c160e3cc6d73075761075a)>)

### [0.4.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.8...v0.4.9) (2020-10-29)

### Features

- добавлена обработка ошибки с сервера для docInput [ref EPGUCORE-39803](<[8641580](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/86415802c1a0ff473dc09f5ea5dfc54da8138fa5)>)

### [0.4.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.19...v0.4.8) (2020-10-29)

### [0.4.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.6...v0.4.7) (2020-10-29)

### Bug Fixes

- возможный фикс принудительного удаления тэга в after_script [ref EPGUCORE-40088](<[6686ad7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6686ad719310d1728c196747965c849a3a6e2939)>)
- доработан gitlab-ci [ref EPGUCORE-40088](<[529ef98](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/529ef98f6461a880f528507ef490c9c51feaef1d)>)

### [0.4.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.5...v0.4.6) (2020-10-29)

### Bug Fixes

- убрал лишний npm install [ref EPGUCORE-40088](<[aa65e5d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa65e5df18bc2add9733151062764bb8a1c057c7)>)

### [0.4.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.4...v0.4.5) (2020-10-29)

### Bug Fixes

- бамп версии 0.4.4 [ref EPGUCORE-40088](<[f5c43ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f5c43aec07f87ce304611e105b29bd82aa04c4c4)>)

### [0.4.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.3...v0.4.4) (2020-10-29)

### Bug Fixes

- бампнул ручками 0.4.3 [ref EPGUCORE-40088](<[2ae55f5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2ae55f53737ac0692eeaf304eb971142c37ff9b4)>)

### [0.4.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.2...v0.4.3) (2020-10-29)

### Bug Fixes

- поправил условие в if блоке [ref EPGUCORE-40088](<[dbe4e95](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dbe4e95fbf96a4497dff2c6403bf940913e7ab24)>)

### [0.4.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.1...v0.4.2) (2020-10-29)

### Bug Fixes

- поправил скрипт [ref EPGUCORE-40088](<[d060476](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d060476fb45adad86a1594b5359978d2c8361717)>)

### [0.4.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.17...v0.4.1) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)
- убрал 'глобальный' стиль border: 0 у button и добавил его на уровне компонентов, где нужно [ref EPGUCORE-38636](<[853f5b5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/853f5b593e4ea53e458910d9b6bbc340d9835fc1)>)

### [0.4.23](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.22...v0.4.23) (2020-11-10)

### Bug Fixes

- добавлен формат TIFF как исключение из сжатия изображений [ref EPGUCORE-40821](<[5d3487f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d3487f015ee7e1d21ab201721ac39af5cea326e)>)
- изменена валидация согласно требованию дизайна [ref EPGUCORE-40776](<[9b99a01](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b99a011649f6ec69c5e17fcfa5b8960541413a0)>)
- Изменил механизм валидации дат [ref: EPGUCORE-40571](<[d884ade](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d884ade4177180632b2ff948f89fe505635db210)>)
- исправил инвертирование даты при возврате назад [EPGUCORE-40838](<[9a6a889](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9a6a889c22af6e054f25c6eaac343718e1be4571)>)
- исправил формат даты [EPGUCORE-40838](<[5d35fe6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d35fe648af206d958a92edb238ca82a622f63a8)>)
- исправлено отображение ошибки required filed после первой потери фокуса с поля [ref EPGUCORE-40916](<[88d1dbb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/88d1dbbda4f2460f38af37a0c829f11a5cbb896f)>)
- обработал случай когда нет адреса. [EPGUCORE-40789][epgucore-40790] ([f447288](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f447288e0dcee1872a72bffe48378b0a828b8d56))
- поправил типы [ref: EPGUCORE-40571](<[0f27184](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f271846ff1fe0af1cfc9f55e879a69bdb03967d)>)

### [0.4.22](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.21...v0.4.22) (2020-11-09)

### Bug Fixes

- добавил скрытие ошибок валидации с бэка после изменения значения в полях для компонента "адрес для временной регистрации" [ref EPGUCORE-37184](<[4e2d798](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4e2d798341a61306454a04b4d61f0c50a38b0d50)>)
- исправлена блокировка перехода на следующий скрин для загрузки файлов [ref EPGUCORE-40730](<[c8965d3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c8965d3b7eb785173b9bb9735354ddcc433daa45)>)
- исправлена вёрстка компонента фото для ipad mini [ref EPGUCORE-40580](<[46cf118](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46cf11882a182c110c72f384ee8cee65ef38bd1b)>)

### [0.4.21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.20...v0.4.21) (2020-11-08)

### Bug Fixes

- исправил ошибку при загрузке фото, файл загружается успешно но не возвращаются данные. ([6b3b5d5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6b3b5d5dbb44c5e7e27dd645ea60719a400e7720))

### [0.4.20](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.19...v0.4.20) (2020-11-08)

### [0.4.19](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.18...v0.4.19) (2020-11-08)

### Bug Fixes

- исправлено прикрепление фото [ref EPGUCORE-40743](<[64d83a1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/64d83a1ad14643cf35dac29043206a80cc4844fc)>)

### [0.4.18](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.17...v0.4.18) (2020-11-07)

### Bug Fixes

- Некорректное отображение экрана Заявление отправлено [EPGUCORE-40644](<[51cac25](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/51cac25c792bc0154b2bafe898b86ca9ba6a9032)>)

### [0.4.17](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.16...v0.4.17) (2020-11-06)

### Bug Fixes

- обраотка успешной загрузки фото без ответа: Комаров ([2d81b2e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2d81b2ee0de3337d6616172c61ce439f6291ccff))

### [0.4.16](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.15...v0.4.16) (2020-11-06)

### Bug Fixes

- добавил блокировку если в dropdown(-е) один элемент.[EPGUCORE-40660](<[b9dc029](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b9dc0299fb85797a6cb07fbac1848558d148a868)>)
- добавил отступ для элементро экрана проверки адреса.[EPGUCORE-40638](<[1386a14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1386a14d30827cc9f287efc5b9ef4eac9571eab9)>)
- изменено название переменной ([6c220f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6c220f449124ff37c7af5d36931065e56bc7da88))
- испаравлено сохранение данных на стр. персональны данных ([9483d59](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9483d59d1dc71f089717ae478c5406a3527d2593))
- исправил валидации на загрузке файлов [ref EPGUCORE-40475](<[e636ae3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e636ae37e4b6ae1efcdf0275019e223c1afafd54)>)
- исправил слипание кнопок находящиеся внизу [EPGUCORE-40638](<[5afc9bb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5afc9bbad09faeb2012a18005203861945929369)>)
- исправлена генерация названия прикреплённого фото [ref EPGUCORE-40654](<[2dfa461](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2dfa46170866f42cc96db5f10f76aa4674035c51)>)
- исправления представление текста для firefox ([bee9bfa](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bee9bfabbc07751bd3264ba55342bb022b8cb6ae))
- исправлено загрузка битых фото, ограничение файлов до 5 мб ([aede393](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aede3931cfc2443da1c510a39bf805faa5e5b64e))
- исправленя по стилям ([3e149cc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3e149cc6aad2eae47bdaa2e0a72e3fec96b1fc9f))
- исправленя по стилям ([99bb418](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/99bb418ce608de44c2e07ea1ddbdd58bc8ea9da3))
- Не верно работает рег. выражение для компонента Кем выдано [EPGUCORE-40630](<[b42910a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b42910a2f47db01c00185c9b27656519825b997d)>)
- Обработка ошибки 404 при падении бронирования таймслотов [EPGUCORE-40431](<[c6f4613](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c6f4613e4bd8e46391732bb2d6733412845d2186)>)
- переименован метод ([f2280ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f2280eae58e9fc9436f960c350d0e135db530e62))
- увеличил зону для клика по кнопкам. Исправил button на библиотечный lib-button [ref EPGUCORE-40434](<[3389fc1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3389fc17cc81ec36714fc30af678985f2aae28fe)>)

### [0.4.15](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.14...v0.4.15) (2020-11-05)

### [0.4.14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.13...v0.4.14) (2020-11-05)

### Features

- зависимость периода выбранных дат календарей [ref EPGUCORE-40403](<[e075837](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e07583722e0ac593d7278486273865c19b2417c0)>)
- Компонент Укажите реквизиты паспорта привести в соответствие с дизайн-контролем [ref: EPGUCORE-40468](<[031a27a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/031a27ad5853e63e5b95c93e2c6e6fadca54bc30)>)
- перевёл компоненты на новый формат ([1de1211](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1de1211f58c7fe04cfa6a15402c80d1a5732641a))

### Bug Fixes

- добавил префиксы для кроссбраузерности; ([d87f03d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d87f03d22418a53d7d6c11b8604a40136a137568))
- добавлены классы для цветов текста, используемых в json-сценариях [ref EPGUCORE-40312](<[5b045ec](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5b045ec809ba24f084719830c5971dbc5819b50a)>)
- исправлен lint [ref EPGUCORE-40346](<[5c52891](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5c5289188e7187293a4a12513de8e29f9df147d1)>)
- исправлен показ компоента MVD [EPGUCORE-40365](<[22af4ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/22af4ab573f223551b0fd39dee2f50eaabd1b624)>)
- исправлена логика отображения кнопки фото [ref EPGUCORE-40433](<[b50c019](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b50c01923eb255820a375ce04113c7e38dd16f18)>)
- исправления ошибки с количеством подгружаемых фалов. ([ab61c68](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ab61c682fb3d6472c09b62a55474cfcb8deb0b9f))
- исправления после merge ([1d742a6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1d742a6d4cf5e3ec6a9c9ea12a6568c1679c7f0e))
- исправлено ограничение по количеству загрузки файлов, по общему размеру файлов [ref EPGUCORE-40346](<[d515201](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d51520140b5227d9646e568461193942e142176f)>)
- исправлено оторажение и блокировка кнопки фото [ref EPGUCORE-40366](<[e2f689c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e2f689c9a9c08042129ccca60d3372317942b8aa)>)
- исправлено состояние блокирование кнопки для компонента загрузки файлов [ref EPGUCORE-39301](<[27a9355](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/27a9355c8aa39d731c6fec31463bae5c52b549a1)>)
- обновил header для обёртки [EPGUCORE-40231](<[37273b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/37273b8dd7c8ceb788d4d979965655d26c9261d3)>)
- стоимость позволяет вводить только числа [ref EPGUCORE-40405](<[534b773](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/534b7732621fbfa5bc42956b018f509eaaaf340a)>)
- удалил статичный текст валидации [ref EPGUCORE-40432](<[dfdcfee](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dfdcfeebb8175319b36e4d1efce350f942f63e22)>)

### [0.4.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.12...v0.4.13) (2020-11-05)

### [0.4.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.11...v0.4.12) (2020-11-02)

### Bug Fixes

- добавлены классы для цветов текста, используемых в json-сценариях [ref EPGUCORE-40312](<[a5ae46d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5ae46db085a69861b5e0243a13a6d3d6b6a4800)>)

### [0.4.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.24...v0.4.10) (2020-10-30)

### [0.4.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.8...v0.4.9) (2020-10-29)

### [0.4.11](https://git.gosuslugi.local///compare/v0.3.26...v0.4.11) (2020-11-02)

### Features

- добавлена обработка ошибки с сервера для docInput [ref EPGUCORE-39803](<[8641580](https://git.gosuslugi.local///commit/86415802c1a0ff473dc09f5ea5dfc54da8138fa5)>)

### Bug Fixes

- added interfaces [ref EPGUCORE-39803](<[1503f5e](https://git.gosuslugi.local///commit/1503f5e2960002e12e0e3b5e0f5cb298d9c91924)>)
- fixed component export [ref EPGUCORE-39803](<[cdb3ac9](https://git.gosuslugi.local///commit/cdb3ac9834446bd292760ae211396e6517cef4df)>)
- вернул на место иконку warn.svg в компоненте confirm-email [ref EPGUCORE-40183-40183](<[070a3e6](https://git.gosuslugi.local///commit/070a3e6ca228b6ffaf4f8e03b24fa02a368cc896)>)
- добавлен свитч кейс для docInput ([17dd775](https://git.gosuslugi.local///commit/17dd775000785036fe805f1209a404f52ed55d33))
- добалена глубокая проверка файла на тип изображения + добавлены дизейбл стили для кнопок компонента фото [ref EPGUCORE-40198](<[4758da2](https://git.gosuslugi.local///commit/4758da238fb99d22f5c160e3cc6d73075761075a)>)
- исправлена работа кнопки "сделать фото" [ref EPGUCORE-39301](<[3052695](https://git.gosuslugi.local///commit/30526952b886c4738e8880257823f0d57158e176)>)

### [0.4.8](https://git.gosuslugi.local///compare/v0.3.19...v0.4.8) (2020-10-29)

### [0.4.7](https://git.gosuslugi.local///compare/v0.4.6...v0.4.7) (2020-10-29)

### Bug Fixes

- возможный фикс принудительного удаления тэга в after_script [ref EPGUCORE-40088](<[6686ad7](https://git.gosuslugi.local///commit/6686ad719310d1728c196747965c849a3a6e2939)>)
- доработан gitlab-ci [ref EPGUCORE-40088](<[529ef98](https://git.gosuslugi.local///commit/529ef98f6461a880f528507ef490c9c51feaef1d)>)

### [0.4.6](https://git.gosuslugi.local///compare/v0.4.5...v0.4.6) (2020-10-29)

### Bug Fixes

- убрал лишний npm install [ref EPGUCORE-40088](<[aa65e5d](https://git.gosuslugi.local///commit/aa65e5df18bc2add9733151062764bb8a1c057c7)>)

### [0.4.5](https://git.gosuslugi.local///compare/v0.4.4...v0.4.5) (2020-10-29)

### Bug Fixes

- бамп версии 0.4.4 [ref EPGUCORE-40088](<[f5c43ae](https://git.gosuslugi.local///commit/f5c43aec07f87ce304611e105b29bd82aa04c4c4)>)

### [0.4.4](https://git.gosuslugi.local///compare/v0.4.3...v0.4.4) (2020-10-29)

### Bug Fixes

- бампнул ручками 0.4.3 [ref EPGUCORE-40088](<[2ae55f5](https://git.gosuslugi.local///commit/2ae55f53737ac0692eeaf304eb971142c37ff9b4)>)

### [0.4.3](https://git.gosuslugi.local///compare/v0.4.2...v0.4.3) (2020-10-29)

### Bug Fixes

- поправил условие в if блоке [ref EPGUCORE-40088](<[dbe4e95](https://git.gosuslugi.local///commit/dbe4e95fbf96a4497dff2c6403bf940913e7ab24)>)

### [0.4.2](https://git.gosuslugi.local///compare/v0.4.1...v0.4.2) (2020-10-29)

### Bug Fixes

- поправил скрипт [ref EPGUCORE-40088](<[d060476](https://git.gosuslugi.local///commit/d060476fb45adad86a1594b5359978d2c8361717)>)

### [0.4.1](https://git.gosuslugi.local///compare/v0.3.17...v0.4.1) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](https://git.gosuslugi.local///commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](https://git.gosuslugi.local///commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](https://git.gosuslugi.local///commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](https://git.gosuslugi.local///commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](https://git.gosuslugi.local///commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](https://git.gosuslugi.local///commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)
- убрал 'глобальный' стиль border: 0 у button и добавил его на уровне компонентов, где нужно [ref EPGUCORE-38636](<[853f5b5](https://git.gosuslugi.local///commit/853f5b593e4ea53e458910d9b6bbc340d9835fc1)>)

### [0.4.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.20...v0.4.10) (2020-10-30)

### Bug Fixes

- added interfaces [ref EPGUCORE-39803](<[1503f5e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1503f5e2960002e12e0e3b5e0f5cb298d9c91924)>)
- fixed component export [ref EPGUCORE-39803](<[cdb3ac9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cdb3ac9834446bd292760ae211396e6517cef4df)>)
- вернул на место иконку warn.svg в компоненте confirm-email [ref EPGUCORE-40183-40183](<[070a3e6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/070a3e6ca228b6ffaf4f8e03b24fa02a368cc896)>)
- добалена глубокая проверка файла на тип изображения + добавлены дизейбл стили для кнопок компонента фото [ref EPGUCORE-40198](<[4758da2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4758da238fb99d22f5c160e3cc6d73075761075a)>)

### [0.4.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.8...v0.4.9) (2020-10-29)

### Features

- добавлена обработка ошибки с сервера для docInput [ref EPGUCORE-39803](<[8641580](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/86415802c1a0ff473dc09f5ea5dfc54da8138fa5)>)

### [0.4.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.19...v0.4.8) (2020-10-29)

### [0.4.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.6...v0.4.7) (2020-10-29)

### Bug Fixes

- возможный фикс принудительного удаления тэга в after_script [ref EPGUCORE-40088](<[6686ad7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6686ad719310d1728c196747965c849a3a6e2939)>)
- доработан gitlab-ci [ref EPGUCORE-40088](<[529ef98](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/529ef98f6461a880f528507ef490c9c51feaef1d)>)

### [0.4.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.5...v0.4.6) (2020-10-29)

### Bug Fixes

- убрал лишний npm install [ref EPGUCORE-40088](<[aa65e5d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa65e5df18bc2add9733151062764bb8a1c057c7)>)

### [0.4.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.4...v0.4.5) (2020-10-29)

### Bug Fixes

- бамп версии 0.4.4 [ref EPGUCORE-40088](<[f5c43ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f5c43aec07f87ce304611e105b29bd82aa04c4c4)>)

### [0.4.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.3...v0.4.4) (2020-10-29)

### Bug Fixes

- бампнул ручками 0.4.3 [ref EPGUCORE-40088](<[2ae55f5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2ae55f53737ac0692eeaf304eb971142c37ff9b4)>)

### [0.4.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.2...v0.4.3) (2020-10-29)

### Bug Fixes

- поправил условие в if блоке [ref EPGUCORE-40088](<[dbe4e95](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dbe4e95fbf96a4497dff2c6403bf940913e7ab24)>)

### [0.4.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.17...v0.4.2) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил скрипт [ref EPGUCORE-40088](<[d060476](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d060476fb45adad86a1594b5359978d2c8361717)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)
- убрал 'глобальный' стиль border: 0 у button и добавил его на уровне компонентов, где нужно [ref EPGUCORE-38636](<[853f5b5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/853f5b593e4ea53e458910d9b6bbc340d9835fc1)>)

### [0.4.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.8...v0.4.9) (2020-10-29)

### [0.4.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.19...v0.4.8) (2020-10-29)

### [0.4.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.6...v0.4.7) (2020-10-29)

### Bug Fixes

- возможный фикс принудительного удаления тэга в after_script [ref EPGUCORE-40088](<[6686ad7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6686ad719310d1728c196747965c849a3a6e2939)>)
- доработан gitlab-ci [ref EPGUCORE-40088](<[529ef98](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/529ef98f6461a880f528507ef490c9c51feaef1d)>)

### [0.4.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.5...v0.4.6) (2020-10-29)

### Bug Fixes

- убрал лишний npm install [ref EPGUCORE-40088](<[aa65e5d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa65e5df18bc2add9733151062764bb8a1c057c7)>)

### [0.4.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.4...v0.4.5) (2020-10-29)

### Bug Fixes

- бамп версии 0.4.4 [ref EPGUCORE-40088](<[f5c43ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f5c43aec07f87ce304611e105b29bd82aa04c4c4)>)

### [0.4.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.3...v0.4.4) (2020-10-29)

### Bug Fixes

- бампнул ручками 0.4.3 [ref EPGUCORE-40088](<[2ae55f5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2ae55f53737ac0692eeaf304eb971142c37ff9b4)>)

### [0.4.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.2...v0.4.3) (2020-10-29)

### Bug Fixes

- поправил условие в if блоке [ref EPGUCORE-40088](<[dbe4e95](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dbe4e95fbf96a4497dff2c6403bf940913e7ab24)>)

### [0.4.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.17...v0.4.2) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил скрипт [ref EPGUCORE-40088](<[d060476](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d060476fb45adad86a1594b5359978d2c8361717)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)
- убрал 'глобальный' стиль border: 0 у button и добавил его на уровне компонентов, где нужно [ref EPGUCORE-38636](<[853f5b5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/853f5b593e4ea53e458910d9b6bbc340d9835fc1)>)

### [0.4.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.6...v0.4.7) (2020-10-29)

### Bug Fixes

- возможный фикс принудительного удаления тэга в after_script [ref EPGUCORE-40088](<[6686ad7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6686ad719310d1728c196747965c849a3a6e2939)>)

### [0.4.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.5...v0.4.6) (2020-10-29)

### Bug Fixes

- убрал лишний npm install [ref EPGUCORE-40088](<[aa65e5d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa65e5df18bc2add9733151062764bb8a1c057c7)>)

### [0.4.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.4...v0.4.5) (2020-10-29)

### Bug Fixes

- бамп версии 0.4.4 [ref EPGUCORE-40088](<[f5c43ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f5c43aec07f87ce304611e105b29bd82aa04c4c4)>)

### [0.4.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.3...v0.4.4) (2020-10-29)

### Bug Fixes

- бампнул ручками 0.4.3 [ref EPGUCORE-40088](<[2ae55f5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2ae55f53737ac0692eeaf304eb971142c37ff9b4)>)

### [0.4.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.4.2...v0.4.3) (2020-10-29)

### Bug Fixes

- поправил условие в if блоке [ref EPGUCORE-40088](<[dbe4e95](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dbe4e95fbf96a4497dff2c6403bf940913e7ab24)>)

### [0.4.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.17...v0.4.2) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил скрипт [ref EPGUCORE-40088](<[d060476](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d060476fb45adad86a1594b5359978d2c8361717)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)

### [0.4.1](https://git.gosuslugi.local///compare/v0.3.17...v0.4.1) (2020-10-29)

### Bug Fixes

- джобы для develop ветки перенесены на stage ветку и для последнего добавлен джоб сборки npm-версии ([73465c1](https://git.gosuslugi.local///commit/73465c12ffcbbbba3e8320cf9ad7ff65ab9fdd1e))
- добавил поддержку prevStep в action.directive, плюс небольшой рефактор [ref EPGUCORE-39850](<[2e7defe](https://git.gosuslugi.local///commit/2e7defef744dd76f24c6997dbd490ccfedec6ff8)>)
- исправил вопрос о доступе камеры для десктопа [ref EPGUCORE-39414](<[ded678e](https://git.gosuslugi.local///commit/ded678ebaed6b046947ebaf65024cdf09fd53e8e)>)
- поправил целевую ветку для мердж-реквестов в gitlab-ci ([a5742ea](https://git.gosuslugi.local///commit/a5742ea49a5a0312917b21d59e39fcf845a44b69))
- поправлен номер версии ([6be1016](https://git.gosuslugi.local///commit/6be101697f59dd13d9defa995ae737075fea0926))
- телефон стирался в случае ошибки перепривязки с бэка во время редактирования [ref EPGUCORE-39421](<[56f2797](https://git.gosuslugi.local///commit/56f27972274f2bce38783f7e7d0fdf7f15b641f8)>)

### [0.3.17](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.16...v0.3.17) (2020-10-28)

### Bug Fixes

- исправлена обработка ошибки в health interceptor ([051a371](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/051a371735280b5305a0076e365d63a7255f7f6c))

### [0.3.16](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.15...v0.3.16) (2020-10-28)

### [0.3.15](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.14...v0.3.15) (2020-10-28)

### Features

- добавлена валидация загружаемых файлов + добавлен title [ref EPGUCORE-40124](<[0912af9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0912af9893f5703922c66be699a797c59e0046e2)>)

### [0.3.14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.13...v0.3.14) (2020-10-28)

### Bug Fixes

- обновил UI для подтвержения телефона ([71d5462](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/71d54629b95730920f2751843c1f33c28a9340cf))
- поправил отступы в cofirm-user-phone-email компоненте [ref EPGUCORE-40050](<[85adffa](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/85adffa4d14555df0e70d825ea664db6ba3e4304)>)

### [0.3.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.12...v0.3.13) (2020-10-27)

### [0.3.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.11...v0.3.12) (2020-10-27)

### Bug Fixes

- рефактор и визуальная доработка компонентов confirm-user-phone и confirm-user-email [ref EPGUCORE-40050](<[f568c83](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f568c83b2181bbce152b9f3e55cd18825ba63f7f)>)

### [0.3.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.9...v0.3.11) (2020-10-27)

### Bug Fixes

- добавлено правильное приведение к ISO-строке для всех DateInput компонентов [ref EPGUCORE-39900](<[e43f528](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e43f528ff98a9731be248b9ce3a42625f7d9b83d)>)
- поправил урл для storageApi в дефолтном конфиге ([36c6151](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/36c615186be8b2c2afdce6e19389585d8fde233b))

## [0.4.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.6...v0.4.0) (2020-10-26)

### Bug Fixes

- поправил иконку черновика в первом диалоговом окне ([cf0033c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cf0033c90958445a433a42eea8ab07f0cae44c6f))

### [0.3.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.9...v0.3.10) (2020-10-27)

### Bug Fixes

- добавлено правильное приведение к ISO-строке для всех DateInput компонентов [ref EPGUCORE-39900](<[e43f528](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e43f528ff98a9731be248b9ce3a42625f7d9b83d)>)
- поправил урл для storageApi в дефолтном конфиге ([36c6151](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/36c615186be8b2c2afdce6e19389585d8fde233b))

## [0.4.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.6...v0.4.0) (2020-10-26)

### Bug Fixes

- поправил иконку черновика в первом диалоговом окне ([cf0033c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cf0033c90958445a433a42eea8ab07f0cae44c6f))

## [0.4.0](https://git.gosuslugi.local///compare/v0.3.6...v0.4.0) (2020-10-26)

### Bug Fixes

- задизейблен дропдаун при наличии одного айтема справочника [ref EPGUCORE-39364](<[802726e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/802726e92be9340fb2cc28fdb83622ee1f8e3aef)>)

### [0.3.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.7...v0.3.8) (2020-10-26)

### [0.3.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.6...v0.3.7) (2020-10-26)

### Bug Fixes

- выравнил стили в плашечках тайм слотов [ref EPGUCORE-39477](<[0362b54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0362b54a7d3b9a9f1fde700eb3146cba2826464f)>)
- выравнил стили в плашечках тайм слотов [ref EPGUCORE-39477](<[3f459a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3f459a2bdbc61ea5cc27b8f8fd28f982c224df79)>)
- добавил возможность использования ограничений minDate maxDate для календаря таймслотов [ref EPGUCORE-38731](<[18f75a1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/18f75a17a4d41d7ee41914235d2e0513cc077473)>)
- добавлено правильное приведение к ISO-строке для всех DateInput компонентов [ref EPGUCORE-39900](<[b3cb0bb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b3cb0bbf1164ebc6cfb7f405554a52f3dd98497f)>)
- исправил логику отключения кнопки Отправить заявление на таймслотах [ref EPGUCORE-39504](<[9d632f5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9d632f5f0d301852d277185732e2475ee485f917)>)
- исправил обработчик первого экрана [EPGUCORE-39788]; ([1097bf0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1097bf07a08a109237d83948aa4a3109be2b3953))
- исправил показ кнопки на редиактирования персональных данных; ([542381d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/542381deb8a27375a650f53b68254027ed4ce078))
- исправлена ошибка создания компонента для фотографирования [ref EPGUCORE-39301](<[a8ef0a1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a8ef0a1f6b91ea0d714ffd1756d9537dc8be2a0d)>)
- поправил иконку черновика в первом диалоговом окне ([51bdfa4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/51bdfa41b7ef99eacb35c65fe5de5db9e17f07d8))
- поправил урл для storageApi в дефолтном конфиге ([7bd0d7e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7bd0d7ec5c3f7703d96a8d2573393efd07725da5))
- убрал большой отступ [ref: EPGUCORE-39560](<[bee412f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bee412f14331f13716ef51af01bcb0cab8df913b)>)

### [0.3.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.5...v0.3.6) (2020-10-26)

### [0.3.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.4...v0.3.5) (2020-10-23)

### Bug Fixes

- дополнил значение по-дефолту для staticDomainAssetsPath конфига ([a8e6187](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a8e61876ecad2eb405be0428822628565c9f2bf3))

### [0.3.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.3...v0.3.4) (2020-10-23)

### Bug Fixes

- добавил инициализацию LoadService; ([a24a8fc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a24a8fc82d207688f40e033bcb6e7777642313d5))
- замьютил сломанный тест для form-player ([d6f5575](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d6f557563b6d3fe1e51852bbade57c33221593fe))

### [0.3.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.3.2...v0.3.3) (2020-10-23)

### Features

- адаптировал DropDown под MvdGiac[EPGUCORE-39440](<[d701d91](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d701d910afddaa0bba80f7ee69bdfc565d2a146d)>)
- добавил абстрактные хранилища. ([51c5a04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/51c5a04bb564cc50dabe28fb1cb273aa4194dc92))
- добавил обработчик MvdGiac на CustomScreen; ([1b91e4a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1b91e4acad1a19d0f68440694bac4744fb797fac))
- логика MvdGias переехала на backend поэтому компонент удалили[EPGUCORE-39440](<[0aa9059](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0aa90591287f668a7303d3afd66df0ad747c1e61)>)

### Bug Fixes

- исправил доступную кнопку далее на экране "Укажите адрес регистрации" а также простановку значения при возврате на экран [ref EPGUCORE-39533](<[5fbcada](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fbcadab73c21e8d78fb7f5bef983ef52365b598)>)
- перекрасил кнопку [ref: EPGUCORE-39553](<[325059b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/325059b9f106ee749ad2e2a75abf070478574eac)>)
- поменял логику работы imgPrefixer и удалил лишние картинки из ассетов [ref EPGUCORE-38123](<[e9fb1da](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e9fb1da4c596a6e8d1a69600b6904164c7bbed7f)>)

### [0.2.19](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.18...v0.2.19) (2020-10-22)

### [0.2.18](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.17...v0.2.18) (2020-10-20)

### Bug Fixes

- вернул интерфейсы[EPGUCORE-38317](<[ea2a9b0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ea2a9b06727d5aa3fafdb490cc68d61a6ffe521f)>)
- удалил не используеме интерфейсы[EPGUCORE-39396](<[6b17b3e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6b17b3eb28fecb5909db77db38295dbac132b8db)>)

### [0.2.17](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.16...v0.2.17) (2020-10-19)

### [0.2.16](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.15...v0.2.16) (2020-10-17)

### Features

- added cssClass to screen data ([2f77d89](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2f77d89be99eb9370ad8c9b74f3444e4d6170b6f))
- added cssClass to screen data ([939fe06](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/939fe06c167d87b86f2fb9f1cce1f1ecfd7b28e3))
- added cssClass to screen data ([c8beacf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c8beacf8174f692fc79f860bcee6a64e9dd06ddd))

### Bug Fixes

- поправил логику определения перевого экрана в navigation компоненте [ref EPGUCORE-38636](<[826d958](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/826d958806548e25be2a1c1d2712c7e310595c19)>)

### [0.3.2](https://git.gosuslugi.local///compare/v0.2.15...v0.3.2) (2020-10-22)

### Features

- добавил возможность применения флага readonly для контролов [ref EPGUCORE-39173](<[32ee1f2](https://git.gosuslugi.local///commit/32ee1f232f814fba48f70e066fb0858484b52f22)>)
- добавил функционал значения по умолчанию для типа инпута Dictionary [ref EPGUCORE-39142](<[b49ca23](https://git.gosuslugi.local///commit/b49ca23732df79ef2423f8146d79e15d56654c6d)>)
- Отображение рубля с помощью класса rubles ([5ac86c1](https://git.gosuslugi.local///commit/5ac86c1a6e3cd4fdce9d06c239c1702d8f3adbb3))
- Отображение рубля с помощью класса rubles ([1576334](https://git.gosuslugi.local///commit/1576334f7223d95a37562aaa451af1c186d87c4b))
- подсчёта высоты компонента, кнопки к низу[EPGUCORE-39016](<[10d826b](https://git.gosuslugi.local///commit/10d826b928cdf58949d6898fccde7a6d2f80d9f3)>)
- убрал текст "необязательно" для чекбоксов [ref EPGUCORE-39382](<[5cc1742](https://git.gosuslugi.local///commit/5cc17427ee2ee15dfb117d6c1be5cd3bb63341e5)>)
- убрал хедер Authorization из запросов оплаты [ref EPGUCORE-39655](<[8b07ae8](https://git.gosuslugi.local///commit/8b07ae8f6fd6b083c8d4793089f96b780532f56b)>)
- уменьшил отступы в шапке [ref EPGUCORE-39600](<[55aad87](https://git.gosuslugi.local///commit/55aad87278da82cd7b3a00a341f565ac5d74baf7)>)

### Bug Fixes

- fix filter for mvd-giac; ([2581385](https://git.gosuslugi.local///commit/2581385d9a499baa7c64e4f5f966b07deed5e692))
- Добавил возможность добавлять не более 20 изменений [ref: EPGUCORE-37598](<[8f53a32](https://git.gosuslugi.local///commit/8f53a32f118e9cca49168137bf52d792936abc4a)>)
- добавил поддержку обязательной mask (и опционально placeholder) для компонента DocInput [ref EPGUCORE-39399](<[efcad03](https://git.gosuslugi.local///commit/efcad03f64e75d12ff6baebe607ab87d63dae957)>)
- добавил поддержку обязательной mask (и опционально placeholder) для компонента PassportLookup [ref EPGUCORE-39399](<[13ff9fd](https://git.gosuslugi.local///commit/13ff9fd5c68eeaebe42e4b9f45ed6858e73040ce)>)
- изменено имя метода [ref EPGUCORE-39248](<[6abc450](https://git.gosuslugi.local///commit/6abc450642afd781e6b998dab342a28ac9d5164b)>)
- ипсравил логику фильтрации и сортировки для MVDGIAS; ([7231ed9](https://git.gosuslugi.local///commit/7231ed9c6a4f6e72cd15e826235c3a50f232c460))
- исправил валидацию необязательных полей [ref: EPGUCORE-39684](<[b76fa69](https://git.gosuslugi.local///commit/b76fa6979f55dabdabacf3d4fc330c2af746d882)>)
- исправил выбор одного региона и валидацию[EPGUCORE-38655](<[f0d1e7b](https://git.gosuslugi.local///commit/f0d1e7b6d7d0918b045a3a1c02b826be253e248b)>)
- исправил высоту модального окна[EPGUCORE-39396](<[926e079](https://git.gosuslugi.local///commit/926e079b01abb4fc75d58fd15c6b612f28e8795e)>)
- исправил дополнительные отступы снизу[EPGUCORE-39423](<[b423559](https://git.gosuslugi.local///commit/b42355931aa33fea55ebddb698a45ee4af3cf692)>)
- исправил зависимые поля для чекбоксов [ref: EPGUCORE-38636](<[357c8c2](https://git.gosuslugi.local///commit/357c8c2ae4038a220568dca69d36246d45979fe9)>)
- исправил обрезание подразделений на карте[EPGUCORE-39475](<[298631e](https://git.gosuslugi.local///commit/298631e169b5099d9f97b43b614397b4592cac27)>)
- исправил проставление выбранного загса, если загс был с 0 индексом в массиве. ([cf9657b](https://git.gosuslugi.local///commit/cf9657ba5224c64214ef20af1c1dbecabee1515f))
- исправление linter(-a)[EPGUCORE-38655](<[8e7e629](https://git.gosuslugi.local///commit/8e7e6293ecff641f37a59a0567793e3e2484ecf4)>)
- исправлено обновление отформатированного значения [ref EPGUCORE-39248](<[149c05e](https://git.gosuslugi.local///commit/149c05e5417ad81def2e15664c2f4c9cc0195dd6)>)
- исправлено фильтрацию для мвд ([9840ca3](https://git.gosuslugi.local///commit/9840ca360b43b7efcd82156c32d5ef5cf36d2b03))
- перевел компонент temporary-registration-addr на использование реактивных форм для корректной работы валидации обязательных полей [ref EPGUCORE-39590](<[98df80f](https://git.gosuslugi.local///commit/98df80ff9ce9c732404fc52cb0ad79d482bc89b8)>)
- поправил логику определения перевого экрана в navigation компоненте [ref EPGUCORE-38636](<[e28f921](https://git.gosuslugi.local///commit/e28f9218e22e24b439584e5d36da6ec5dc46eb3a)>)
- поправил работу зависимых ref'ов для Lookup и Dictionary компонентов, переименовал isEqual -> isEqualObj [ref EPGUCORE-38636](<[4a0380c](https://git.gosuslugi.local///commit/4a0380c3b87caf9761de1f59ec6cc9606e0d4428)>)
- поправил тесты, добавил флаг для npm run test:dev, который выводит РЕАЛЬНУЮ ошибку в тестах [ref EPGUCORE-38636](<[95e7833](https://git.gosuslugi.local///commit/95e7833303c924c80148db6b3f40ef571e9ccc71)>)
- поправил форму селектора детей, чтобы сразу был один селектор для выбора [ref EPGUCORE-39624](<[e14a314](https://git.gosuslugi.local///commit/e14a314b68e36c1079b6d82aa671ddab28511f11)>)
- поправлено оформление кода [ref EPGUCORE-38977](<[e802590](https://git.gosuslugi.local///commit/e8025903dc75712e6c52edbffa0c10d7b503c2f9)>)
- починил пару тестов, убрал рудиментные isCycledFields где нужно [ref EPGUCORE-38636](<[e161fd0](https://git.gosuslugi.local///commit/e161fd03d32e0f86fdde48f5c8874a7902915e31)>)
- починил селектор 'Добавить нового ребенка' [ref EPGUCORE-38636](<[a5e72ce](https://git.gosuslugi.local///commit/a5e72ceda7f6d3c8c98192ff97fbbb9612a374b9)>)
- починила валидацию полей в customValidator ([69f7ce3](https://git.gosuslugi.local///commit/69f7ce3799af227eed5fd55bba2885863882a587))
- убрал [object Object] для компонента regAddr при обработке ошибки с бэка о недействительном адресе [ref EPGUCORE-38977](<[20a08d0](https://git.gosuslugi.local///commit/20a08d011d8c55bcb2bff2b7d1c96c4ba316ef38)>)
- убрал лишний импорт [ref: EPGUCORE-38636](<[6405309](https://git.gosuslugi.local///commit/64053093fe170a7ee3b7a3559e91dbd77bcc29d5)>)
- убрала копейки в стоимости ([89cb3be](https://git.gosuslugi.local///commit/89cb3be90d69014d4313b28e101651c96df55424))

### [0.2.15](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.14...v0.2.15) (2020-10-16)

### Bug Fixes

- break line ([59ffe0c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/59ffe0c2753e9c339301cf5c4cc24dae02f29cf5))
- CityInput поправил контрол ([498028f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/498028fb9459492939ecd0e94696c51b7e823eb9))
- cleare console, moved services from module to component provider ([d0b2ebd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d0b2ebdbe5044090541d83a59a72d595d907cf06))
- fixed placeholder displaying bug [ref EPGUCORE-39060](<[5a6f92c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a6f92cd2c4473bde3ccab990c459c781564dbcb)>)
- native scroll at confirmation modal on mobile device ([0f4ad61](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f4ad61e212a60832dce765e246f9f8658af0c50))
- native scroll at confirmation modal on mobile device ([cd10fa8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cd10fa850efdddd1ceb2be0e2af165eac7da3295))
- spec ([ded51a4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ded51a4690a796fae2844c58c47f34249c15dcc5))
- spec ([aa8d36d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/aa8d36d18c1bb370d581194f295c865a28d451e4))
- spec ([52be84c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/52be84c6a2b6df584e2f757ee8ed50f34f7b878b))
- specs ([46ee9aa](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46ee9aa710f9cf14d8719894749172a07843ea65))
- в Загране добавил валидацию даты "по" в деятельности за 10 лет ([3b7e65f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3b7e65fc041423e9a3ef762f1eb6cbe64f478d1c))
- Временно отключил тест ([fc65582](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/fc655828742c7b2530eb1119de39b59e25614790))
- Для мобильного приложения будет применяться мобильный нативный скрол, где для прокручивания применялась стороняя библиотека ([098e28a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/098e28a2f915f36cbad38817341dc6efaa824928))
- добавил обработку репитбл, добавил проверку на валидность в репитбл ([2a08c88](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2a08c88b1af5345c94e20a3fd629069081efca92))
- исправил валидацию от сторонних библиотек ([eeb06a9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eeb06a9215cc3ae99dbc8348ed3f0abba6763b12))
- исправил деятельность за 10 лет после мержа девелопа ([89e0e1b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/89e0e1b2553aa3f2560b536ec2d16739271a5bb6))
- Исправил обработку значения чекбокса ([d6857bb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d6857bbf50dad74b952221dc184b3d2566b0a37f))
- Исправил ошибку "Expression has changed after it was checked" ([b8eff12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b8eff12ff7446136e91c2ac56fdca996ada2adef))
- Исправил ошибку, которая возникала в реактиве componentError\$ ([53902ef](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/53902ef90f21e42406af51f5e3707c04967b4db0))
- исправил патчинг значений в зависимых компонентах ([d9430cf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d9430cfb7c24af5bb8a73daae6a80b4c68507935))
- Исправил подгрузку данных с бэка ([16dcdf7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/16dcdf78a9f19c77342a3b26ce60ffecc7e9c5cd))
- Поправил патч сохпраненных значений в AddressInput & CityInput ([8169ef7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8169ef72aa681b1db7bbe68d33918229350743bb))
- поправил типизацию ([31d2c74](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/31d2c746cd514a7129cde918b3c663da621c71f8))
- Пофиксил спеку ([668e8f8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/668e8f84066f5c31699744f0f1b20b273f7a509b))
- Убрал подписи под календарями в услуге "Загран" ([6b89ee5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6b89ee5ea7e130167c647ce3dc77cd86e07405c6))
- фикс правки после мержа ([626313d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/626313d513c0266a6d400b6c0149535526d71085))

### [0.2.14](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.13...v0.2.14) (2020-10-15)

### Features

- added redirectToLk action to footer in the INFO screen [ref EPGUCORE-39033](<[b34b7d7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b34b7d7b95957e93b0d25a6b7fed4c9e8cbaeb8d)>)
- настроена возможность перехода на выбранный ранее загс [ref EPGUCORE-38771](<[5fdd002](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fdd0025b282d971876ba3acaed571ad100c5358)>)

### Bug Fixes

- add-new-child form generating via components-list support [ref EPGUCORE-38025](<[ef08ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef08ded4e693c381b7e959da9647e71967df5b17)>)
- added condition to show placeholder or mask as placeholder ([f18d99a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f18d99a39cc18cbf3424c0376d049b261797f904))
- bugfix for snils cashed value in screen.service ([5a8ed96](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a8ed960a036b1887e17803409b14286809a9e49))
- invitation-error.component: fixed view of result screen [ref EPGUCORE-38516](<[8ff8fdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8ff8fddc8b3085f2b1deb832d7f165ddbdc96ea5)>)
- make invitationUrl optional [ref EPGUCORE-38636](<[5fd9052](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5fd9052ef159a8a02cecc44eea2bf5034ea5210c)>)
- remove typo in confirmChildData type [ref EPGUCORE-38025](<[594e0b1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/594e0b14f5ec307933837ce2fab4f358f8f03171)>)
- remove unneccessary cycledFields onInit logic in confirmPersonalUserAddress component [ref EPGUCORE-38025](<[d470c4d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d470c4dbb4b3cee38365a769b23db23f6bfc0473)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[2bf3292](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf329216efdec98d7547e61a44a73d53f0836c5)>)
- rename add-children component to select-children component [ref EPGUCORE-38025](<[f48c3e7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f48c3e76e70229e4f49ffaae77bc8a7a1a95e80f)>)
- resolve child name passing to select list [ref EPGUCORE-38025](<[a6d3cfd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a6d3cfd4f66df4b2658b2898fd1c7f9148327474)>)
- resolve doubling buttons on component footer issue [ref EPGUCORE-38025](<[1f7679e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1f7679e95e1c345d536d9c80aff70e34efb78a30)>)
- small refactor in select-children-screen template [ref EPGUCORE-38636](<[dccf362](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/dccf3624e7f99a8434aadf79246a6a6b9cfcd831)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[3b4e27f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3b4e27f7ae1fad7cc04555422ba0a64ba686c3fa)>)
- update select children list processing logic [ref EPGUCORE-38025](<[46a03ce](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/46a03ce910dfed8ab2d088b5c8288107271c5286)>)
- update select children list processing logic [ref EPGUCORE-38025](<[eaeb9bd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eaeb9bd0f57ed33a53029cafa6488e839208070b)>)
- update select children logic for cycled scenarios, remove redundant cycled handlers [ref EPGUCORE-38025](<[6898a94](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6898a94b16d210587aed40c9f582bc0553176265)>)
- исправил нерабочий инпут [virtualScroll]="true" для lookup ([ace9dcf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ace9dcfb8134b96a70a2c357f035b0f491723cec))
- исправлена кривая стрелочка на кнопках ([f753a5b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f753a5bfc9a835827120dd3848f1a82b6c243900))

### [0.2.13](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.12...v0.2.13) (2020-10-14)

### Bug Fixes

- make invitationUrl optional [ref EPGUCORE-38636](<[9e8998e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9e8998ebd2941ed7378142b09a59c79eba043a13)>)

### [0.2.12](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.11...v0.2.12) (2020-10-14)

### Bug Fixes

- исправил мерж пресета и кэша в случае когда preset просто строка, а не JSON ([5eaada8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5eaada8ab279ffb69e687ae0b8761ad3c780de23))

### [0.2.11](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.10...v0.2.11) (2020-10-14)

### Features

- add confirmChildData type for confirm user data component [ref EPGUCORE-38920](<[26a33b4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/26a33b49c597430dc2aaf9b9ae613f2b295dc1a7)>)
- invitation-error.component update [EPGUCORE-38516](<[7b6bd62](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7b6bd6258c878338d2ca9c7ba5e7bc6f027fbb9a)>)
- новые флаги для кнопок disable и hidden [ref EPGUCORE-38882](<[18ed131](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/18ed13184dae67548cbfff8e0f892a93fc20fac0)>)

### Bug Fixes

- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[8b03a27](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/8b03a275af64dd821b0ac6c8f7a00bfd2b7fd46c)>)
- add img max-width: 100% style on form-player level [ref EPGUCORE-38636](<[76ffe7e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/76ffe7e777c685771c958c0fb667b3c09d1f01cf)>)
- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[250a59e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/250a59eac3213537696190a2cbafbeea7c666294)>)
- correct cycledFieldsValue for repeatable-fields dataTransform logic [ref EPGUCORE-38878](<[15e4e72](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e4e72773b937a3d590f2746f8fd2bb9eb217ca)>)
- typo in confirmChildData [ref EPGUCORE-38636](<[586f8f2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/586f8f2d9c7dc13a913f7e434504155af98b6a61)>)
- update auto version bump for lib bundle ([15e9371](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/15e9371e644d0fc22fcefb284cea7b4fb9c3cd2d))
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([5e778ad](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e778ad738c5b2e877a4e123b2744613bf7f5fee))
- добавил проверку на несуществующие поля, что бы не валились ошибки. ([b8f75b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b8f75b8b9743a0fd72108d795f2ba4a274d423c1))
- исправил фильтрацию для восстановление данных. ([9c6f6c0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c6f6c05d700d422653fb8b93982a9b7dd05fe20))

### [0.2.10](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.9...v0.2.10) (2020-10-13)

### Bug Fixes

- new inline radio buttons on mobile ([c45c34c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c45c34cc457cea7ffaeefba7a7ea1a9c80b418e3))
- добавил поддержку модальных окон в subheader ([7015755](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/701575591e40e22dc97c8544dab8c177e8bad45d))

### [0.2.9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.8...v0.2.9) (2020-10-13)

### Bug Fixes

- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[b6a4336](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b6a43361ded61b75e283496991f53071b1abe3a7)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[0c60e0d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0c60e0d50969e85dd7d63590fd9db1a621f53422)>)
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[f4cd0ab](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f4cd0ab2a4f4fd82e3458d54f30e7b44f9475e7a)>)
- определили функцию которая решает какие данные нужно брать из кеша. ([414cf0b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/414cf0b2715cc4fe71252f54899d4767a32ab873))

### [0.2.8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.7...v0.2.8) (2020-10-12)

### Bug Fixes

- remove doubling staticDomainAssetsPath props for icon in draft modal [ref EPGUCORE-36456](<[3fa4229](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3fa4229d463327dddba07ad9f21a665ba63d0696)>)
- resolve postinstall issue [ref EPGUCORE-36456](<[3235848](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3235848f660345d6b5d5789b9220af080e1ad97e)>)
- update auto version bump for lib bundle [ref EPGUCORE-36456](<[5006009](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5006009d8536b0abbdb8346544c5e26b3d65e7d3)>)

### [0.2.7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.6...v0.2.7) (2020-10-12)

### Features

- added payCode get from JSON ([1ebffeb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1ebffeb3edfe96cee6862c1f7eb5a8213b587e76))

### Bug Fixes

- исправил затирание preset value из cachedAnswers [ref EPGUCORE-38623](<[faee444](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/faee4446a0b72e1be068cec302646765a0a8947c)>)

### [0.2.6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.5...v0.2.6) (2020-10-12)

### Bug Fixes

- add static assets for json-scenarios [ref EPGUCORE-38123](<[11e22e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/11e22e89e32b89f8931f56a03cdbbb447fba2016)>)

### [0.2.5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.4...v0.2.5) (2020-10-11)

### Features

- новый тип компонента CityInput [ref EPGUCORE-38643](<[0544f7d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0544f7d23a814b1c0eb355a7c92281299e97fd6a)>)

### Bug Fixes

- refactoring ([132b870](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/132b8706f44d2b7802125a3ae5757771bbbadc38))
- refactoring ([55b90b3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/55b90b32ad736cbe6040296355fb62c3ee05a928))
- исправил "назад" для MapService [ref EPGUCORE-38644](<[eb22099](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eb22099c3601b3788192c9a8b678661fdeddccad)>)
- Исправил патчинг формы за 10 лет ([496e886](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/496e886abed6d26a037491f3d6bf81ae69bc5f52))
- исправл возвращение обратна на страницу персональных данных. ([695bc21](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/695bc214cab870051182162e0f642781ac381d4b))

### [0.2.4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.4) (2020-10-11)

### Features

- Добавил новые методы для расчета деятельность ([b7a45f7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b7a45f7f35946417ac1e4e443a3bbe14d2d97777))
- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- New calc function ([0f87b2f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f87b2f812305fb137af70675c0471efebeecab9))
- New calc function ([3811e42](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3811e421cd0f66976501155b4ba1e5b5f70f29a5))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- repair displayOn ref functionality for Lookup/Dictionary/DropDown lists [ref EPGUCORE-36456](<[0ed9f4f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0ed9f4f56516bb870e757fbbd5b3bd2c4b14b5c5)>)
- resolve RadioInput boolean values validation issue [ref EPGUCORE-36456-dev](<[f608586](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f60858657566b002d93e3fb4a984cd8d64e50a8c)>)
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- добавил айдишники для календарей ([99e806b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/99e806b1fe97ab0fe700eb4949bb0a4519908cd0))
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))
- удалил коммент ([4198b54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4198b54cd1923c61c1efc7e7733db2f8664dc86e))

### [0.2.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.3) (2020-10-11)

### Features

- Добавил новые методы для расчета деятельность ([b7a45f7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b7a45f7f35946417ac1e4e443a3bbe14d2d97777))
- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- New calc function ([0f87b2f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f87b2f812305fb137af70675c0471efebeecab9))
- New calc function ([3811e42](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3811e421cd0f66976501155b4ba1e5b5f70f29a5))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- repair displayOn ref functionality for Lookup/Dictionary/DropDown lists [ref EPGUCORE-36456](<[0ed9f4f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0ed9f4f56516bb870e757fbbd5b3bd2c4b14b5c5)>)
- resolve RadioInput boolean values validation issue [ref EPGUCORE-36456-dev](<[f608586](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f60858657566b002d93e3fb4a984cd8d64e50a8c)>)
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- добавил айдишники для календарей ([99e806b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/99e806b1fe97ab0fe700eb4949bb0a4519908cd0))
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))
- удалил коммент ([4198b54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4198b54cd1923c61c1efc7e7733db2f8664dc86e))

### [0.2.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.2.1...v0.2.2) (2020-10-10)

### Features

- Добавил новые методы для расчета деятельность ([b7a45f7](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b7a45f7f35946417ac1e4e443a3bbe14d2d97777))
- новый тип компонента CityInput [ref EPGUCORE-38030](<[c904fc3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c904fc34ea348bc0dc5b95c30b32f111b8014302)>)

### Bug Fixes

- add PassportLookup component to components list [ref EPGUCORE-36456](<[7c13b8c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7c13b8c160a388aebdc080a1eb0fad21e46214dd)>)
- fixes for calculation ([9b318ae](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9b318ae8cc51c95358e492bb2f5e344e210deb30))
- New calc function ([48f51bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/48f51bfd37b4dc0d379cadb1758d0ab7969e524a))
- New calc function ([0f87b2f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0f87b2f812305fb137af70675c0471efebeecab9))
- New calc function ([3811e42](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/3811e421cd0f66976501155b4ba1e5b5f70f29a5))
- new init merge ([a9e75a2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a9e75a2d4d25c98458c5b7988018ebcc05d30e66))
- new terrabyte url, allowCamera fix, get list of documents fix ([eced5cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/eced5cb00344530f5dc12a75b70ecaba3f491e3c))
- remove unneccessary epgu-lib config init on form-player load [ref EPGUCORE-36456](<[68081ea](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/68081eae3636f8c3894fe27c4523421d6611c3f7)>)
- Rename isEqualObject to isEqual ([d1b7030](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d1b7030d74aad0f4bc834f8f04b711eb22caa1a1))
- rename of function getBillsInfo and fix already payed error ([5e8d6d4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5e8d6d46bf76332afde3b7fdd399377345729899))
- repair displayOn ref functionality for Lookup/Dictionary/DropDown lists [ref EPGUCORE-36456](<[0ed9f4f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0ed9f4f56516bb870e757fbbd5b3bd2c4b14b5c5)>)
- resolve RadioInput boolean values validation issue [ref EPGUCORE-36456-dev](<[f608586](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f60858657566b002d93e3fb4a984cd8d64e50a8c)>)
- translate PersonLookup -> PassportLookup [ref EPGUCORE-36456](<[ee92917](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ee92917110a34b8aaf10c1c6496319c06b7b95f4)>)
- update epgu-lib@0.0.589 with hotfix for month-picker and temporary remove social-share buttons [ref EPGUCORE-36456](<[b59051c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b59051c774066bae96fdd3cfbb9484ed31e88a23)>)
- вернуть поддержку компонент ([4fa80c4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fa80c4b6b9b0ff4146b903550dec36994d65a7e))
- добавил hideLevels для dadataWidget в components-list ([bf91b3d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/bf91b3dfce815757dd4f95d0c3f80955b11aebd4))
- добавил hideLevels для dadataWidget в components-list ([b18e4fe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b18e4feefc27fe7aad14c856aa78ab48f1c3dae6))
- добавил айдишники для календарей ([99e806b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/99e806b1fe97ab0fe700eb4949bb0a4519908cd0))
- Добавил сохранение данных на форме "10 лет", добавил валидацию формы ([97ca953](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/97ca9531eb9cf3fba6bf22e8468cbf9e7c3dcbdb))
- добавил условие выхода из под сценария ([5d2b6a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5d2b6a82a0615ed110645340b9ed3ba44096b28b))
- заменил placeholder на маску ([caa2928](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/caa29282c619bb6556d91afaa017db2e817c9e3c))
- Исправил сохранение данных, исправил ошибку линтера ([d773294](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d773294799ccb7d19c88671f1173dd3e2d08c8c9))
- Исправил спеку форм сервиса ([040ecdd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/040ecdde18fb341f64a6529c98486d82a3d79b86))
- исправлен показ адреса при возврар назад;[EPGUCORE-38016](<[f1811f4](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f1811f423353fe82e2ff952b60a3e54209c4e832)>)
- исправлена ошибка пересчета в слотах на таймзону клиента [ref EPGUCORE-38255](<[9c1be04](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/9c1be04f54a1830bb1c415d2042576335c44c955)>)
- исправлено пересечение экранов на карте и центровка выбранного объекта [ref EPGUCORE-38103](<[ae40f2b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ae40f2be4aa3765f96d0bbeb35f19fced70a6a51)>)
- Поправил формулировку для экрана s29 ([b08ebf2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b08ebf2f2bfbdc0853a5b58311d3f6d29b2dc2d3))
- удалил коммент ([4198b54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4198b54cd1923c61c1efc7e7733db2f8664dc86e))

### [0.2.1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.32...v0.2.1) (2020-10-09)

### Features

- Added control of next button from uploaded files in blocks ([900c9fc](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/900c9fca3a52fa7541914086d0342886e32a51ca))
- Added control of next button from uploaded files in blocks (MergeWithMaster) ([94a1b6e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/94a1b6e8bc1c9adbf62c4bae833302cae0e47969))
- New url from attrs link attribute ([8572240](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/85722407215e1b4a11c276e3a8089c6269364fea))
- Добавил новые методы для расчета деятельность ([22c0436](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/22c04368335fb976a70fb632f122d05dc5a794d8))

### Bug Fixes

- 2 rubles for any test.gosuslugi.ru domain ([e5a05a6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e5a05a603c8b4727210cebe1130dd300bf86064c))
- 2 rubles for any test.gosuslugi.ru domain ([981bcfb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/981bcfb9468bfc7e7756bc20c40b37f206e156bf))
- bump epgu-lib@0.0.589, remove social-share till 25.10 [ref EPGUCORE-36456](<[4b291d0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4b291d0c138a1e6cd9ab717712604fe39a658e1a)>)
- More elegant function ([db2c61e](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/db2c61e666b7ac1db7bf26711d4b26cefe3548f7))
- repair displayOn ref functionality for Lookup/Dictionary/DropDown lists [ref EPGUCORE-36456](<[027e789](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/027e7890d90fda5e75418419ea22eec445353650)>)
- resolve possibly empty attrs prop in component on InfoScr issue ([ef0fd65](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef0fd65693682a7366e63c12f0d2ea679bf7ad7f))
- адрес регистрации всегда редактируемый[EPGUCORE-37832](<[5c4d78f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5c4d78f60823b7b98aa1180e599af9860918bef4)>)
- добавил айдишники для календарей ([a6d3dba](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a6d3dbaf28629222b719bdb8a1bffda7754191da))
- добавил отправку данных на бэк ([77c33cd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/77c33cd18ffbd48e583085f457884e3cf95e77e1))
- удалил коммент ([a382dc5](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a382dc521d90faf6faa0f8fb345f4282d1e642da))

### [0.1.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.1...v0.1.3) (2020-09-28)

### Bug Fixes

- added example comments ([b0ff3db](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b0ff3db2305501082035c1e53924161b9b286af9))
- fixed id reference [ref EPGUCORE-37058](<[5342ecd](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5342ecdbc2a5f3011f0f1411763d7831c92fe3d1)>)
- fixed remarks [ref EPGUCORE-37058](<[0a38f31](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0a38f312115ebc077cad39de7a2b3adf7a354942)>)
- move auth interceptor init on form-player level [ref EPGUCORE-36943](<[37aa131](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/37aa1315d25f36d3e1cdd926101589118411a415)>)
- revert auth interceptor replace on app level [ref EPGUCORE-36943](<[ef6e55a](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/ef6e55ac906cfbd6c9adfcaafab6667527436111)>)
- update for file uploading ([cd82bee](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cd82beeaef9236b1bb53a1e9b40f46a65e7ec819))

## [0.2.0](https://git.gosuslugi.local///compare/v0.1.32...v0.2.0) (2020-10-09)

### Features

- Added control of next button from uploaded files in blocks ([900c9fc](https://git.gosuslugi.local///commit/900c9fca3a52fa7541914086d0342886e32a51ca))
- Added control of next button from uploaded files in blocks (MergeWithMaster) ([94a1b6e](https://git.gosuslugi.local///commit/94a1b6e8bc1c9adbf62c4bae833302cae0e47969))
- New url from attrs link attribute ([8572240](https://git.gosuslugi.local///commit/85722407215e1b4a11c276e3a8089c6269364fea))
- Добавил новые методы для расчета деятельность ([22c0436](https://git.gosuslugi.local///commit/22c04368335fb976a70fb632f122d05dc5a794d8))

### Bug Fixes

- 2 rubles for any test.gosuslugi.ru domain ([e5a05a6](https://git.gosuslugi.local///commit/e5a05a603c8b4727210cebe1130dd300bf86064c))
- 2 rubles for any test.gosuslugi.ru domain ([981bcfb](https://git.gosuslugi.local///commit/981bcfb9468bfc7e7756bc20c40b37f206e156bf))
- bump epgu-lib@0.0.589, remove social-share till 25.10 [ref EPGUCORE-36456](<[4b291d0](https://git.gosuslugi.local///commit/4b291d0c138a1e6cd9ab717712604fe39a658e1a)>)
- More elegant function ([db2c61e](https://git.gosuslugi.local///commit/db2c61e666b7ac1db7bf26711d4b26cefe3548f7))
- repair displayOn ref functionality for Lookup/Dictionary/DropDown lists [ref EPGUCORE-36456](<[027e789](https://git.gosuslugi.local///commit/027e7890d90fda5e75418419ea22eec445353650)>)
- resolve possibly empty attrs prop in component on InfoScr issue ([ef0fd65](https://git.gosuslugi.local///commit/ef0fd65693682a7366e63c12f0d2ea679bf7ad7f))
- адрес регистрации всегда редактируемый[EPGUCORE-37832](<[5c4d78f](https://git.gosuslugi.local///commit/5c4d78f60823b7b98aa1180e599af9860918bef4)>)
- добавил айдишники для календарей ([a6d3dba](https://git.gosuslugi.local///commit/a6d3dbaf28629222b719bdb8a1bffda7754191da))
- добавил отправку данных на бэк ([77c33cd](https://git.gosuslugi.local///commit/77c33cd18ffbd48e583085f457884e3cf95e77e1))
- удалил коммент ([a382dc5](https://git.gosuslugi.local///commit/a382dc521d90faf6faa0f8fb345f4282d1e642da))

### [0.1.3](https://git.gosuslugi.local///compare/v0.1.1...v0.1.3) (2020-09-28)

### Bug Fixes

- added example comments ([b0ff3db](https://git.gosuslugi.local///commit/b0ff3db2305501082035c1e53924161b9b286af9))
- fixed id reference [ref EPGUCORE-37058](<[5342ecd](https://git.gosuslugi.local///commit/5342ecdbc2a5f3011f0f1411763d7831c92fe3d1)>)
- fixed remarks [ref EPGUCORE-37058](<[0a38f31](https://git.gosuslugi.local///commit/0a38f312115ebc077cad39de7a2b3adf7a354942)>)
- move auth interceptor init on form-player level [ref EPGUCORE-36943](<[37aa131](https://git.gosuslugi.local///commit/37aa1315d25f36d3e1cdd926101589118411a415)>)
- revert auth interceptor replace on app level [ref EPGUCORE-36943](<[ef6e55a](https://git.gosuslugi.local///commit/ef6e55ac906cfbd6c9adfcaafab6667527436111)>)
- update for file uploading ([cd82bee](https://git.gosuslugi.local///commit/cd82beeaef9236b1bb53a1e9b40f46a65e7ec819))

### [0.1.32](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.31...v0.1.32) (2020-10-08)

### Bug Fixes

- fixes for payment ([93f3167](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/93f3167c1b10bff0d3cc1e056430a8ce94c00e2d))
- fixes for payment ([f974e43](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/f974e43a2f83759a7afdd02fe50cc0ea7bcea9ed))

### [0.1.31](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.30...v0.1.31) (2020-10-08)

### Bug Fixes

- text-transform-directive: fixed cursor behaviour in masked input [ref EPGUCORE-38086](<[c6aab82](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c6aab82b4007dd73462f0e3fd06bf60769b95e41)>)

### [0.1.30](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.29...v0.1.30) (2020-10-08)

### Bug Fixes

- Добавил патчинг справочников ([65605e9](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/65605e93b5387cf6a567c3c9f66dc7b2cb871c4b))
- Загрузка справочников ([cf37c53](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/cf37c53a855919be1f91996403aa4c1ebafae936))

### [0.1.29](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.28...v0.1.29) (2020-10-08)

### Bug Fixes

- hidden home in custom screen address; ([62de3cb](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/62de3cb585e6672c7ef30b71d24431630d1e6c1a))

### [0.1.28](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.27...v0.1.28) (2020-10-07)

### [0.1.27](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.26...v0.1.27) (2020-10-07)

### [0.1.26](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.25...v0.1.26) (2020-10-07)

### Bug Fixes

- add auto version bump, changelog generation on master marge via gitlab pipelines [ref EPGUCORE-36456](<[10e67b8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/10e67b8d66c318a19be9a9e9b610cf6a41c7668a)>)

### [0.1.25](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.21...v0.1.25) (2020-10-07)

### Bug Fixes

- add hidden condition for social buttons configurable show/hide state [ref EPGUCORE-37307](<[c5c4920](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c5c4920e59d1cbf87b6fe75d8e0c1150658a6d62)>)
- add obligatory social share buttons on InfoScreen component [ref EPGUCORE-37307](<[402fa53](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/402fa53e3f4daccba7549c319d2564430db9bd01)>)
- auto test [ref EPGUCORE-36456](<[a345ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a345dedd1068624228d326d395d8bb6fd0918e1f)>)
- auto test 2 [ref EPGUCORE-36456](<[02b367c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/02b367cf510a3120c784177570e56cd09e86ad0e)>)
- auto test 3 [ref EPGUCORE-36456](<[361d8d6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/361d8d621fbbaa9b232d122fcd4417a9b0d13619)>)
- auto test 4 [ref EPGUCORE-36456](<[d860032](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d860032a48a75ebaa7648c98324a90332a4ad38f)>)
- auto test 5 [ref EPGUCORE-36456](<[c46b08c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c46b08c2d03451710651d3956c28d8f4dfa59645)>)
- EPGUCORE-38088 [Загранпаспорт] Дублирование данных подразделения на странице "Выберите подразделение для подачи документов" [ref EPGUCORE-38088](<[b78ebac](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b78ebacb8e634055990c8cf52a80e5aff60f2413)>)
- EPGUCORE-38196 fix cross right position ([10ba361](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/10ba361673f026c9a0cf14f6f2ba8aaa106c9d27))
- EPGUCORE-38196 fix modal lists ([4edaa51](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4edaa512cd9bd822552e40de58d937dc26325688))
- EPGUCORE-38196 fix ol list style ([73b7c54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73b7c54b26d34b1ffbcc4d3dab8578070f24046b))
- EPGUCORE-38196 use OutputHtmlComponent at modal content ([1a3f6ca](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1a3f6ca1e0cf80640ba7fc6b7c96e1204c01d32c))
- EPGUCORE-38258 fix hidden close button on modal ([185790f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/185790ff2c8d83dcac395ac5922cf238b40e53a2))
- final test gitlag-ci config [ref EPGUCORE-36456](<[0d1eabe](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/0d1eabed49e998ae4d0721281fab3b187c4176f5)>)
- hotfix npm run release script [ref EPGUCORE-36456](<[31a385c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/31a385ccf54235ac1737f49081805b459be55205)>)
- hotfix replace social shares buttons [ref EPGUCORE-37307](<[e56a0bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e56a0bf5c95aac534c03838972d6d51240e07a0f)>)
- New background color and fix for upload file again ([5a19fdf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a19fdfaf7819b3fee70319dfbb28e2cf75d741a))
- remove tag [ref EPGUCORE-36456](<[6cb7f50](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6cb7f50485869dbdc287bf15477940d8d8524bcc)>)
- resolve code review issues [ref EPGUCORE-38123](<[692e0ed](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/692e0edb69428431ae4555ca31fb4a5a9a1c4cb1)>)
- update CI_USER [ref EPGUCORE-36456](<[070c01f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/070c01fd03b3791b008523b42bece081a6e9e56d)>)
- update CI_USER 2 [ref EPGUCORE-36456](<[e6ff7ba](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e6ff7ba563051020fec823836b098cd06e60c2d9)>)
- update REPO_URL [ref EPGUCORE-36456](<[7948ef2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7948ef21dd6cb8af5195dbfeaeef7b931861a9ea)>)
- update REPO_URL 2 [ref EPGUCORE-36456](<[4bca0e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4bca0e80d72c9a04e2e0343196f5822461afd197)>)
- Вернул функции валидации для ОГРН ИНН и СНИЛС ([2c2c28b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2c2c28b5735fa1e3ca67b33fdc1a164968a85c06))
- Добавил disabled контролов ([712029f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/712029f2db8f27b77cfd7a3e84222efb7d948092))
- Добавил поддержку масок для компонентов типа StringInput, исправил прелодер данных, восстановил работоспособность компонентов Dictionary и Lookup [EPGUCORE-38328](<[42468f8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/42468f800e1f9a3df600631cd756421dd8d6d86e)>)
- Добавил строгое сравнение ([fed5626](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/fed56264d8e28d55e253738a2b887f779d4f358c))
- Испарвил загрузку сохранненых данных для DateInput [EPGUCORE-38328](<[e7e0c58](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e7e0c58647e7cb6a95b3a20df3faf057667e1844)>)
- Испрпвлен патчинг формы дефолтным значением [EPGUCORE-38328](<[c669478](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c6694789540e44504d1291221adcbb39ea7a9c68)>)
- Поправил справочники ([2bf681d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf681dfda76f114a102c8ae33ccbf2a5284c376))
- Рефакторинг ([2d0a5a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2d0a5a8e5331ba7e8760b80693633705381a3121))
- Рефакторинг ([4fc49c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fc49c1e8b4654381802c4abcdfcf188b4a8e42d))

### [0.1.24](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/compare/v0.1.21...v0.1.24) (2020-10-07)

### Bug Fixes

- add hidden condition for social buttons configurable show/hide state [ref EPGUCORE-37307](<[c5c4920](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c5c4920e59d1cbf87b6fe75d8e0c1150658a6d62)>)
- add obligatory social share buttons on InfoScreen component [ref EPGUCORE-37307](<[402fa53](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/402fa53e3f4daccba7549c319d2564430db9bd01)>)
- auto test [ref EPGUCORE-36456](<[a345ded](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/a345dedd1068624228d326d395d8bb6fd0918e1f)>)
- auto test 2 [ref EPGUCORE-36456](<[02b367c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/02b367cf510a3120c784177570e56cd09e86ad0e)>)
- auto test 3 [ref EPGUCORE-36456](<[361d8d6](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/361d8d621fbbaa9b232d122fcd4417a9b0d13619)>)
- auto test 4 [ref EPGUCORE-36456](<[d860032](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/d860032a48a75ebaa7648c98324a90332a4ad38f)>)
- auto test 5 [ref EPGUCORE-36456](<[c46b08c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c46b08c2d03451710651d3956c28d8f4dfa59645)>)
- EPGUCORE-38088 [Загранпаспорт] Дублирование данных подразделения на странице "Выберите подразделение для подачи документов" [ref EPGUCORE-38088](<[b78ebac](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/b78ebacb8e634055990c8cf52a80e5aff60f2413)>)
- EPGUCORE-38196 fix cross right position ([10ba361](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/10ba361673f026c9a0cf14f6f2ba8aaa106c9d27))
- EPGUCORE-38196 fix modal lists ([4edaa51](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4edaa512cd9bd822552e40de58d937dc26325688))
- EPGUCORE-38196 fix ol list style ([73b7c54](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/73b7c54b26d34b1ffbcc4d3dab8578070f24046b))
- EPGUCORE-38196 use OutputHtmlComponent at modal content ([1a3f6ca](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/1a3f6ca1e0cf80640ba7fc6b7c96e1204c01d32c))
- EPGUCORE-38258 fix hidden close button on modal ([185790f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/185790ff2c8d83dcac395ac5922cf238b40e53a2))
- hotfix npm run release script [ref EPGUCORE-36456](<[31a385c](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/31a385ccf54235ac1737f49081805b459be55205)>)
- hotfix replace social shares buttons [ref EPGUCORE-37307](<[e56a0bf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e56a0bf5c95aac534c03838972d6d51240e07a0f)>)
- New background color and fix for upload file again ([5a19fdf](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/5a19fdfaf7819b3fee70319dfbb28e2cf75d741a))
- remove tag [ref EPGUCORE-36456](<[6cb7f50](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/6cb7f50485869dbdc287bf15477940d8d8524bcc)>)
- resolve code review issues [ref EPGUCORE-38123](<[692e0ed](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/692e0edb69428431ae4555ca31fb4a5a9a1c4cb1)>)
- update CI_USER [ref EPGUCORE-36456](<[070c01f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/070c01fd03b3791b008523b42bece081a6e9e56d)>)
- update CI_USER 2 [ref EPGUCORE-36456](<[e6ff7ba](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e6ff7ba563051020fec823836b098cd06e60c2d9)>)
- update REPO_URL [ref EPGUCORE-36456](<[7948ef2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/7948ef21dd6cb8af5195dbfeaeef7b931861a9ea)>)
- update REPO_URL 2 [ref EPGUCORE-36456](<[4bca0e8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4bca0e80d72c9a04e2e0343196f5822461afd197)>)
- Вернул функции валидации для ОГРН ИНН и СНИЛС ([2c2c28b](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2c2c28b5735fa1e3ca67b33fdc1a164968a85c06))
- Добавил disabled контролов ([712029f](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/712029f2db8f27b77cfd7a3e84222efb7d948092))
- Добавил поддержку масок для компонентов типа StringInput, исправил прелодер данных, восстановил работоспособность компонентов Dictionary и Lookup [EPGUCORE-38328](<[42468f8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/42468f800e1f9a3df600631cd756421dd8d6d86e)>)
- Добавил строгое сравнение ([fed5626](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/fed56264d8e28d55e253738a2b887f779d4f358c))
- Испарвил загрузку сохранненых данных для DateInput [EPGUCORE-38328](<[e7e0c58](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/e7e0c58647e7cb6a95b3a20df3faf057667e1844)>)
- Испрпвлен патчинг формы дефолтным значением [EPGUCORE-38328](<[c669478](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/c6694789540e44504d1291221adcbb39ea7a9c68)>)
- Поправил справочники ([2bf681d](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2bf681dfda76f114a102c8ae33ccbf2a5284c376))
- Рефакторинг ([2d0a5a8](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/2d0a5a8e5331ba7e8760b80693633705381a3121))
- Рефакторинг ([4fc49c1](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/commit/4fc49c1e8b4654381802c4abcdfcf188b4a8e42d))

### [0.1.21](https://git.gosuslugi.local///compare/v0.1.20...v0.1.21) (2020-10-06)

### Bug Fixes

- change Clarification import ([f4e596b](https://git.gosuslugi.local///commit/f4e596b39df23ba88ece9530e4ccc396d0fd1f24))
- change spec and remove @Input components prop ([0d71b1b](https://git.gosuslugi.local///commit/0d71b1be4b935d4ecc7820180e8ee91f1b3f7309))
- display button in time slots ([0ff178a](https://git.gosuslugi.local///commit/0ff178a3a102763c6b8cdd09d11ac4b73ed98112))
- formplayer api cachedAnswers ([5aba834](https://git.gosuslugi.local///commit/5aba834132a9a6d67b94f63521defd8ff1cb0264))
- resolve imgPrefixer triggers twice issue, add new assets imgs, ([21fe526](https://git.gosuslugi.local///commit/21fe526a43e0a08b8687035861d45e335d4fbfac))
- upd componentList for repeatable fields ([656f6d5](https://git.gosuslugi.local///commit/656f6d5976ed913fc199c0089e90e83753bfe7f3))
- update epgu-lib in project/epgu-constructor [ref EPGUCORE-36456](<[18a9438](https://git.gosuslugi.local///commit/18a943856307af1059d0ed433210855900ee51fc)>)

### [0.1.20](https://git.gosuslugi.local///compare/v0.1.19...v0.1.20) (2020-10-05)

### Bug Fixes

- add epgu-lib config load on form-player init [ref EPGUCORE-36456](<[19c3c3c](https://git.gosuslugi.local///commit/19c3c3c531191d2bae98bc477a7cea9bfe5671f5)>)
- resolve test errors 2 [ref EPGUCORE-38123](<[562c014](https://git.gosuslugi.local///commit/562c0145064dd87f76a237e156011a4728e9c34b)>)
- исправлено обновление данные в компоненте адрес регистрации ([d2c6e67](https://git.gosuslugi.local///commit/d2c6e67a7f99a50a8286d55ed21f6e9c51406b6c))
- исправлено позиционирование кнопки в модальном окне ([9cbf452](https://git.gosuslugi.local///commit/9cbf452b46f3ef364f57952ab66429e010c678fe))
- опустил кнопку редактирования на уровень lable; ([26d9ecd](https://git.gosuslugi.local///commit/26d9ecd7fca8c45e2d9c4dd7e51a76686ff0fb3b))

### [0.1.19](https://git.gosuslugi.local///compare/v0.1.18...v0.1.19) (2020-10-02)

### Bug Fixes

- resolve test errors [ref EPGUCORE-38123](<[e943bcf](https://git.gosuslugi.local///commit/e943bcfbe3ff07228248a7895897bc0d7ae79762)>)

### [0.1.18](https://git.gosuslugi.local///compare/v0.1.17...v0.1.18) (2020-10-02)

### Bug Fixes

- add img-prefixer pipe for imgs provided within dynamic html-content [ref EPGUCORE-36456](<[20df748](https://git.gosuslugi.local///commit/20df748b43f8792be0a4f7e1fc1847e310f87fa0)>)

### [0.1.17](https://git.gosuslugi.local///compare/v0.1.16...v0.1.17) (2020-10-02)

### Bug Fixes

- EPGUCORE-38011 [DEV][f] Замечание по карте ([82ec50c](https://git.gosuslugi.local///commit/82ec50c16f38224a3c052a15b63465f996ddcd64))
- next and prev page values save on CUSTOM page ([8394071](https://git.gosuslugi.local///commit/839407109ef2d7aef4ae581bd36f7dddf540961a))
- remove disable state for regAddr field in confirm-personal-user-address due to business requirement [ref EPGUCORE-36456](<[8df23c7](https://git.gosuslugi.local///commit/8df23c73d012cc5ec36e9cb9f2dc392c74a07960)>)
- добавил скрытие дома в адресе регистрации ([d0047bb](https://git.gosuslugi.local///commit/d0047bb63d97669e0f8c8d7d1fd3d382142891db))

### [0.1.16](https://git.gosuslugi.local///compare/v0.1.15...v0.1.16) (2020-10-01)

### Bug Fixes

- added delete file error ignoring [ref EPGUCORE-36117](<[a6a6926](https://git.gosuslugi.local///commit/a6a69265c94347653c2f13ad16ce406658ae242b)>)
- revert epgu-lib dynamic config loading [ref EPGUCORE-36456](<[e0fd58b](https://git.gosuslugi.local///commit/e0fd58b8fa5908fc4524625ab183785ed9189777)>)

### [0.1.15](https://git.gosuslugi.local///compare/v0.1.14...v0.1.15) (2020-10-01)

### Bug Fixes

- add script copy epgu-lib lib-assets in incapsulated epgu-contructor dist [ref EPGUCORE-37993](<[ee3c487](https://git.gosuslugi.local///commit/ee3c4872a52ad1b3f3a4eb7baa3182623e8b5863)>)
- move lib version to assets folder [ref EPGUCORE-37993](<[56f558a](https://git.gosuslugi.local///commit/56f558a4e87d17c21c827f9102f098f08f65dea8)>)
- ипсравил обработку обработку когда нет адреса;[EPGUCORE-37976](<[3cf1438](https://git.gosuslugi.local///commit/3cf14389823a259ac95a4bcc26990fcde62c1db8)>)

### [0.1.14](https://git.gosuslugi.local///compare/v0.1.13...v0.1.14) (2020-10-01)

### [0.1.13](https://git.gosuslugi.local///compare/v0.1.12...v0.1.13) (2020-10-01)

### Bug Fixes

- добавил фильтр для установки заголовковж; ([e2300cc](https://git.gosuslugi.local///commit/e2300ccb77cbacc6a78d2f24ece718ef78b0ab03))

### [0.1.12](https://git.gosuslugi.local///compare/v0.1.11...v0.1.12) (2020-09-30)

### Bug Fixes

- fixed modal displaying [ref EPGUCORE-36117](<[bde8af0](https://git.gosuslugi.local///commit/bde8af0ab967a915e7433a51253aa8b7b242de6a)>)
- updade font-weight for .bold/b/strong elements [ref EPGUCORE-36456](<[3c66f88](https://git.gosuslugi.local///commit/3c66f88a31e0be23d9769da899d45d9ddbfa1129)>)

### [0.1.11](https://git.gosuslugi.local///compare/v0.1.10...v0.1.11) (2020-09-30)

### Bug Fixes

- add jq dep for docker building instance [ref EPGUCORE-36456](<[44c058c](https://git.gosuslugi.local///commit/44c058ce0d1370af8e01aeff7e2fddab840bf38a)>)
- hotfix in environment.ts [ref EPGUCORE-36456](<[7535fc7](https://git.gosuslugi.local///commit/7535fc7b560926ca51b3b921ab48c014cfeaa28b)>)
- remove unneccessary script in package.json [ref EPGUCORE-36456](<[ecd0fc3](https://git.gosuslugi.local///commit/ecd0fc36962e2c2aea9db897a5687bd6edfea8ce)>)
- revert gitlab-ci library-publish process [ref EPGUCORE-36456](<[96bcfb8](https://git.gosuslugi.local///commit/96bcfb8bb8b8943eca9dc15442397d7b65f1a647)>)
- test gitlab-ci new library-publish process [ref EPGUCORE-36456](<[3273bdb](https://git.gosuslugi.local///commit/3273bdb766c4ef4d3124b7fb699094aa35eb1a99)>)
- update Epgulib load service init proccess [ref EPGUCORE-36456](<[cd2fd8c](https://git.gosuslugi.local///commit/cd2fd8c1a23526a51b329aa19ac6f5f8e7a31307)>)

### [0.1.10](https://git.gosuslugi.local///compare/v0.1.9...v0.1.10) (2020-09-29)

### Bug Fixes

- resolve code reviews 2 [ref EPGUCORE-36456](<[89d4939](https://git.gosuslugi.local///commit/89d49393f704fbe019cb3792fefa070e09b80625)>)

### [0.1.9](https://git.gosuslugi.local///compare/v0.1.8...v0.1.9) (2020-09-29)

### Bug Fixes

- resolve code-review comments [ref EPGUCORE-36456](<[b5b9b35](https://git.gosuslugi.local///commit/b5b9b358a28d3ef15de8de4a0d2562bcc7b07f09)>)

### [0.1.8](https://git.gosuslugi.local///compare/v0.1.7...v0.1.8) (2020-09-29)

### Bug Fixes

- resolve cycledFieldsValue formating issue if any date component presented on custom screen [ref EPGUCORE-36456](<[d772918](https://git.gosuslugi.local///commit/d772918dd945679c35a68ae7c3b17ac28ceb1e62)>)

### [0.1.7](https://git.gosuslugi.local///compare/v0.1.6...v0.1.7) (2020-09-29)

### Bug Fixes

- update cycled fields dataTransform to support several fieldNames refs in component [ref EPGUCORE-36456](<[2f3ff97](https://git.gosuslugi.local///commit/2f3ff977bbf0d9ad29a49eb323d7fdb4c7eaeebd)>)

### [0.1.6](https://git.gosuslugi.local///compare/v0.1.4...v0.1.6) (2020-09-29)

### Bug Fixes

- remove unneccessary AuthInterceptor on app level [ref EPGUCORE-36456](<[92f3007](https://git.gosuslugi.local///commit/92f3007884cafb616a206d0b5b97b5812e313d3e)>)

### [0.1.5](https://git.gosuslugi.local///compare/v0.1.4...v0.1.5) (2020-09-29)

### [0.1.4](https://git.gosuslugi.local///compare/v0.1.1...v0.1.4) (2020-09-29)

### Features

- added image compressor to photo upload component [ref EPGUCORE-36117](<[8c712cb](https://git.gosuslugi.local///commit/8c712cbc3705613bc89b58252376965c9a8c0e00)>)
- added photo editor [ref EPGUCORE-36117](<[24d3df4](https://git.gosuslugi.local///commit/24d3df45f660b351fe2697c5141f8eb97a73433e)>)
- added photo uploading [ref EPGUCORE-36117](<[294d508](https://git.gosuslugi.local///commit/294d508293cecf05b08fd41f6acf3868c5e47ef6)>)
- added supporting for hidden block in confirmation modal + refactoring [ref EPGUCORE-37332](<[de7d43b](https://git.gosuslugi.local///commit/de7d43baa66bd2abe0d1a7f7b2e18d59e239ab4d)>)

### Bug Fixes

- Again right return url ([e55d746](https://git.gosuslugi.local///commit/e55d746161971b825fc00a432f400b99140b676d))
- Again right return url ([f9f4056](https://git.gosuslugi.local///commit/f9f4056c384cf802e247d22ae7503b41251f6f0c))
- changed font and line-height on typ mixings [ref EPGUCORE-36117](<[33306d7](https://git.gosuslugi.local///commit/33306d79a720d79a93b32ad04963288e6634e783)>)
- changed orderId [ref EPGUCORE-36117](<[7df0a12](https://git.gosuslugi.local///commit/7df0a1208d17a807154c0132a9e3cf08e1a3469e)>)
- fixed file uploading ([11bcd72](https://git.gosuslugi.local///commit/11bcd72e90bc9e015d3caf1a174810eaaff25e4d))
- fixed proxy [ref EPGUCORE-36117](<[ac3bb27](https://git.gosuslugi.local///commit/ac3bb276c1539a3abfcc5f637b532550516d390b)>)
- fixed remarks + file uploading [ref EPGUCORE-36117](<[d161ef5](https://git.gosuslugi.local///commit/d161ef576673f96612f10297adfe901b268c4f9a)>)
- fixed test [ref EPGUCORE-36117](<[3efa797](https://git.gosuslugi.local///commit/3efa79793885eebcce09abae36ef6b46955ca74c)>)
- hotfix for right payment ([a03ce67](https://git.gosuslugi.local///commit/a03ce672ff01d4dabdd16a6e36fc769959ae583a))
- move auth interceptor to app level [ref EPGUCORE-36943](<[c898b0c](https://git.gosuslugi.local///commit/c898b0c063cf7caef3cdddc31aec57bee20529f8)>)
- removed debugger [ref EPGUCORE-36117](<[6a365e3](https://git.gosuslugi.local///commit/6a365e3e1ffb579522b4bb8398fbbeae2ab1633a)>)
- update lib-map externalMode flag for proper map assets loading on prod [ref EPGUCORE-36456](<[63d61e4](https://git.gosuslugi.local///commit/63d61e459f191e4a7f298e14147e1985cedc41d5)>)
- на мобильной верси, на экране вопрос/ответ прибил кнопки action к низу ([793848a](https://git.gosuslugi.local///commit/793848a1f93b0de2ca2bcc7a6589f6463554a5f0))

### [0.1.3](https://git.gosuslugi.local///compare/v0.1.1...v0.1.3) (2020-09-28)

### Bug Fixes

- Again right return url ([e55d746](https://git.gosuslugi.local///commit/e55d746161971b825fc00a432f400b99140b676d))
- Again right return url ([f9f4056](https://git.gosuslugi.local///commit/f9f4056c384cf802e247d22ae7503b41251f6f0c))
- fixed file uploading ([11bcd72](https://git.gosuslugi.local///commit/11bcd72e90bc9e015d3caf1a174810eaaff25e4d))
- hotfix for right payment ([a03ce67](https://git.gosuslugi.local///commit/a03ce672ff01d4dabdd16a6e36fc769959ae583a))
- move auth interceptor init on form-player level [ref EPGUCORE-36943](<[37aa131](https://git.gosuslugi.local///commit/37aa1315d25f36d3e1cdd926101589118411a415)>)
- move auth interceptor to app level [ref EPGUCORE-36943](<[c898b0c](https://git.gosuslugi.local///commit/c898b0c063cf7caef3cdddc31aec57bee20529f8)>)
- revert auth interceptor replace on app level [ref EPGUCORE-36943](<[ef6e55a](https://git.gosuslugi.local///commit/ef6e55ac906cfbd6c9adfcaafab6667527436111)>)
- на мобильной верси, на экране вопрос/ответ прибил кнопки action к низу ([793848a](https://git.gosuslugi.local///commit/793848a1f93b0de2ca2bcc7a6589f6463554a5f0))

### [0.1.2](https://git.gosuslugi.local///compare/v0.1.1...v0.1.2) (2020-09-25)

### Bug Fixes

- Again right return url ([e55d746](https://git.gosuslugi.local///commit/e55d746161971b825fc00a432f400b99140b676d))
- Again right return url ([f9f4056](https://git.gosuslugi.local///commit/f9f4056c384cf802e247d22ae7503b41251f6f0c))
- fixed file uploading ([11bcd72](https://git.gosuslugi.local///commit/11bcd72e90bc9e015d3caf1a174810eaaff25e4d))
- hotfix for right payment ([a03ce67](https://git.gosuslugi.local///commit/a03ce672ff01d4dabdd16a6e36fc769959ae583a))
- на мобильной верси, на экране вопрос/ответ прибил кнопки action к низу ([793848a](https://git.gosuslugi.local///commit/793848a1f93b0de2ca2bcc7a6589f6463554a5f0))

### [0.1.1](https://git.gosuslugi.local///compare/v0.1.0...v0.1.1) (2020-09-25)

## [0.1.0](https://git.gosuslugi.local///compare/v0.0.1...v0.1.0) (2020-09-25)

### Features

- add confirmAnotherUserData component support [ref EPGUCORE-36456](<[85885ac](https://git.gosuslugi.local///commit/85885accedf22beab71e060b411f8ab3bb0ab2bd)>)
- add staticDomainAssetsPath config prop to set urls to assets [ref EPGUCORE-36456](<[d2b3c76](https://git.gosuslugi.local///commit/d2b3c7622d0976156de8351896435310dcc82e8e)>)
- add staticDomainAssetsPath config prop to set urls to assets [ref EPGUCORE-36456](<[df6fe47](https://git.gosuslugi.local///commit/df6fe47178e7b1d3b7dc86f6bc8e8d4b64165513)>)
- add ToogleFields component to custom screen ([11df28f](https://git.gosuslugi.local///commit/11df28f8626683fd79d14a1874219d78971b12e3))
- add ToogleFields component to custom screen ([4cba5a2](https://git.gosuslugi.local///commit/4cba5a297371a86d302800f462dd8c2e212c2164))
- вывод версии приложения; ([b2bccd7](https://git.gosuslugi.local///commit/b2bccd7193d1254bea600524db7f3d75f502f065))
- добавил error, componentError поле в screen.service;[EPGUCORE-36855](<[c2098f9](https://git.gosuslugi.local///commit/c2098f92bf83ea81a822c2b495aaf54bd346f921)>)
- добавил обработку телефона в components-list;[EPGUCORE-36855](<[64a8f77](https://git.gosuslugi.local///commit/64a8f774c8082bceb226978ebf699eccdf42c168)>)
- добавил таймер обратного отсчёта;[EPGUCORE-36855](<[86e9c87](https://git.gosuslugi.local///commit/86e9c87105046d19af209ff9f78f2cabb1b91305)>)
- Добавлена маска для stringInput [ref EPGUCORE-36951](<[e52e2da](https://git.gosuslugi.local///commit/e52e2dac105f8750d8613d024a2623e4cb28af94)>)
- Добавлена маска для stringInput [ref EPGUCORE-36951](<[4aa6126](https://git.gosuslugi.local///commit/4aa61264316ec7a956884e28b64c55f09b372809)>)
- Добавлена маска для stringInput [ref EPGUCORE-36951] исправил небольшие замечания, сделал код более читабельным. ([f7bbf21](https://git.gosuslugi.local///commit/f7bbf21e3f184c63fb25b6debbab7a21a1323bae))
- обновил взаимодействие с навигацией и добавил возможность проброса опций;[EPGUCORE-36855](<[a5555c1](https://git.gosuslugi.local///commit/a5555c10ecbe79864a16896f70d344ba707ecd2d)>)
- обработчик выхода из подсценария на ифно экране;[EPGUCORE-36855](<[01f185c](https://git.gosuslugi.local///commit/01f185c8ef7c90f80e35a662ac53195c1b7d1c22)>)
- расширил screen.service, теперь он имеет доступ к разлиным свойствам, DTO ([3ff46b7](https://git.gosuslugi.local///commit/3ff46b7f114bc9bd22d75dcbd91cbecd19c68508))
- создал новый компонент подтверждения телефона ([cf79bcf](https://git.gosuslugi.local///commit/cf79bcfd074a27e22d636f38e766c26723e63226))

### Bug Fixes

- add .versionrc config file [ref EPGUCORE-36456](<[0708375](https://git.gosuslugi.local///commit/070837569a66322149b9abf413ba7b57f785129a)>)
- add business-errors passing to components-list components [ref EPGUCORE-37256](<[c243b85](https://git.gosuslugi.local///commit/c243b85fb6c3648ac5cbf1253fde82f50aa8816f)>)
- add hideLevels support for AddressInput [ref: EPGUCORE-36456](<[abdba37](https://git.gosuslugi.local///commit/abdba37db23c205ad2027cc8c89262c3f4c565fd)>)
- add horizontal view for RadioInput groups, ([afaa483](https://git.gosuslugi.local///commit/afaa483dbabdb27f0e427fb29433190a421757ac))
- add isDefault support for RadioInput [EPGUCORE-36456](<[fa62117](https://git.gosuslugi.local///commit/fa6211786cc42b3e68e684838e9fe4a952395591)>)
- add missing Modal components as entryPoint components [ref EPGUCORE-36456](<[f362fb7](https://git.gosuslugi.local///commit/f362fb7f48ecf72b740b12d61cff33d5a1dd9ff3)>)
- add missing modal entry point components [ref EPGUCORE-36456](<[244d6c5](https://git.gosuslugi.local///commit/244d6c5d37992a984cd6d5c9d60dd622bbd9c5d0)>)
- add missing UnsubscribeService for providers in @Component decorator [ref EPGUCORE-36456](<[c50013f](https://git.gosuslugi.local///commit/c50013fd8d4c694941bcf22d319a7f4f3d2c786d)>)
- add missing web-shoot component as entry point component [ref EPGUCORE-36456](<[67bbc9d](https://git.gosuslugi.local///commit/67bbc9decb1e8dc592f13cbd24d130c256552f66)>)
- add obligatory prefix for Icons url used in select-map-object service [ref EPGUCORE-36456](<[b861c0c](https://git.gosuslugi.local///commit/b861c0c4f86861020c0fafaf390113be90795717)>)
- add passing cycledValues data in confirm-personal-user-data component [ref EPGUCORE-36456](<[953c5e6](https://git.gosuslugi.local///commit/953c5e6bd2a0e410ad8abac8ba03abc8c0425a42)>)
- add passing cycledValues data in confirm-personal-user-data component [ref EPGUCORE-36456](<[098ee33](https://git.gosuslugi.local///commit/098ee33d220fff426862dc06976fc2caa5cfad54)>)
- AddressInput should return fullAddressObject instead [EPGUCORE-36456](<[6683550](https://git.gosuslugi.local///commit/66835502644143d551195e0704c8ce2cafd48cd3)>)
- hotfix comfirm personal user address config missing [ref EPGUCORE-36456](<[7f50148](https://git.gosuslugi.local///commit/7f5014885f6b98b41d5ebbf174fe9fd9e5023a8d)>)
- hotfix ConfirmPersonalUserAddress component add missing configService in template [ref EPGUCORE-36456](<[f8783e5](https://git.gosuslugi.local///commit/f8783e56e833f68d88fefa073863a479e7cef6e3)>)
- hotfix for AddressInput hideLevels props ([51dc0ac](https://git.gosuslugi.local///commit/51dc0acf97f4e350d1c9a1e80cb5c619a5b6157f))
- icons styles url pathes [ref EPGUCORE-36456](<[cc672a4](https://git.gosuslugi.local///commit/cc672a48a7f10bb357eb57064424b9e644478b54)>)
- move dist/epgu-constructor assets on root level [ref EPGUCORE-36456](<[e51e718](https://git.gosuslugi.local///commit/e51e7181f82ab42a69565ea760503243f2fa567f)>)
- move dist/epgu-constructor assets on root level [ref EPGUCORE-36456](<[fd6884b](https://git.gosuslugi.local///commit/fd6884ba83d02636643b06aceceda2e00b1e2272)>)
- move modal components entry points to shared module [ref EPGUCORE-36456](<[65ee490](https://git.gosuslugi.local///commit/65ee490d7618c6540977696397c3539de140e800)>)
- pass full address object for AddressInput component [EPGUCORE-36456](<[fda5fd9](https://git.gosuslugi.local///commit/fda5fd98368c215e5993640dcd957e44de2ce38c)>)
- remove global style for button background, causing visual glitch, when form-player injected in portal [ref EPGUCORE-36456](<[470c4d3](https://git.gosuslugi.local///commit/470c4d336b85d4d78f097475c08fa64eb328e0e4)>)
- remove unneccessary duclicated form\_\_error blocks [ref EPGUCORE-37256](<[4843dec](https://git.gosuslugi.local///commit/4843dec25d32cccf73e20a8a7b50aff5b56d53e4)>)
- remove unneccessary npm package [ref EPGUCORE-36456](<[a25c898](https://git.gosuslugi.local///commit/a25c898d1ad0aa519cd4d07159b68a38d94924ba)>)
- remove unneccessary npm package [ref EPGUCORE-36456](<[16849e7](https://git.gosuslugi.local///commit/16849e71fc69fdde6be4e8f10faef8683a924298)>)
- rename setValidationState function to more explicit setValidationAndValueState [EPGUCORE-36456](<[3baa4c8](https://git.gosuslugi.local///commit/3baa4c8c07f544e920061e101afbcd4603bc3747)>)
- resolve build errors [ref EPGUCORE-36456](<[1a95757](https://git.gosuslugi.local///commit/1a95757475012d631ea7362527f2e36cb67a4ca8)>)
- resolve deps error issue due to lazy-load integration support [ref EPGUCORE-37065](<[c87bdde](https://git.gosuslugi.local///commit/c87bddeae43fec089666e17e90f3300ae1a2610b)>)
- resolve double-qouting data from DateInput component [EPGUCORE-36728](<[2edb291](https://git.gosuslugi.local///commit/2edb291e7cffc3893aa843de6198d408c814ee7f)>)
- resolve isValueValid broken logic [ref EPGUCORE-36456](<[d2aa06e](https://git.gosuslugi.local///commit/d2aa06e83e40c2dd557b18d8c964ec404edb703d)>)
- resolve ngOnChanges event handling in confirm-personal-user-address component ([f75a332](https://git.gosuslugi.local///commit/f75a33205a249db99b5f920bf5e4104c6534b1e5))
- resolve ngOnChanges event handling in confirm-personal-user-address component ([5d227aa](https://git.gosuslugi.local///commit/5d227aae34eaa783145b7e018b94814ea7dc113d))
- resolve review comments [ref EPGUCORE-37256](<[cad648d](https://git.gosuslugi.local///commit/cad648d49420d2988c2e77936a0c39b9fcc4283a)>)
- resolve review comments [ref EPGUCORE-37256](<[049916c](https://git.gosuslugi.local///commit/049916c8af34893ded243146fcb4be37811487da)>)
- resolve review issues [ref EPGUCORE-36456](<[fb40344](https://git.gosuslugi.local///commit/fb403449d9f25246ceef1956fcbdcbacc9b323af)>)
- resolve scale issue on iPhone, align bullets in ul lists [ref EPGUCORE-36456](<[0034734](https://git.gosuslugi.local///commit/0034734d5ac6be894fd5d4e30b84e80517c31608)>)
- resolve test error [ref EPGUCORE-36456](<[b9dbf6c](https://git.gosuslugi.local///commit/b9dbf6c9ebc1e68380931be876f939dff19ef2e8)>)
- return fullAddress string instead of full dadata-object in AddressInput component [EPGUCORE-36456](<[bf6b06c](https://git.gosuslugi.local///commit/bf6b06cd023748309539abfa96d6ecaf28cf5b64)>)
- return missing icons in prod build by resolving thier proper paths and add scroll to top logic on navigate event [ref EPGUCORE-36456](<[cbe7f21](https://git.gosuslugi.local///commit/cbe7f2158cd26aaa3e35105e1fd5c59163a820f8)>)
- revert absolute path to assets in build process [ref EPGUCORE-36456](<[31ebaf1](https://git.gosuslugi.local///commit/31ebaf1db92b832da9d228329b56e6654f74dbab)>)
- revert absolute path to assets in build process [ref EPGUCORE-36456](<[bdc7003](https://git.gosuslugi.local///commit/bdc70030aba06aae037386ff80f2bd7b6c6a939a)>)
- set explicit background-color: transparent for close-button, replace custom Add new child button with lib-button [ref EPGUCORE-36456](<[20ff381](https://git.gosuslugi.local///commit/20ff3815f4d053f6faf4e61d72938aba86da85e8)>)
- update date return in ISOString format as ([b44d49b](https://git.gosuslugi.local///commit/b44d49bdfefac3a47fedd85ff4e8ea1241ac80c5))
- update entryComponents list in FormPlayer module [ref EPGUCORE-36456](<[858d8d5](https://git.gosuslugi.local///commit/858d8d5d580c32a04f6f47f56df55db6b99f77ff)>)
- update form subscription on init logic in confirm-personal-user-address component [ref EPGUCORE-36456](<[765a44e](https://git.gosuslugi.local///commit/765a44e3cf1fee1d862c2f67cc01a56ca0bd442e)>)
- update PersonLookup (add-passport) component to support cycledFields scenarios [ref EPGUCORE-36456](<[01a188d](https://git.gosuslugi.local///commit/01a188d498690e97180406febfbcb08932b30dc4)>)
- update related components displayOn attribute for DropDown components as controller [ref EPGUCORE-37396](<[959230e](https://git.gosuslugi.local///commit/959230ed7434947a807a41a66b513cee8c581d7b)>)
- update test for ConfirmPersonalUserData [ref EPGUCORE-36456](<[0a3504c](https://git.gosuslugi.local///commit/0a3504c81855703766ad7b6594b8444631478c2b)>)
- добавил обрабортку несуществующих свйост при обращении к полям. ([284dea5](https://git.gosuslugi.local///commit/284dea598577e3cc5ddc0713372d40691cf9d7be))
- добавил проверку на существования `currentValue` в confirm-personal-user-address [EPGUCORE-36855](<[db3809f](https://git.gosuslugi.local///commit/db3809f7fafba1d579b1134b8af5a45303ab6873)>)
- испавление boolet(-a) ([49505a4](https://git.gosuslugi.local///commit/49505a4eb96cecdbd6ae0656b319df4bbac05e7e))
- исправление замечаний по карте после демо [ref EPGUCORE-36955](<[92ccd21](https://git.gosuslugi.local///commit/92ccd2154ba142dfd35e6f9b481e561ac10911f5)>)
- исправление от anndragan@luxoft.com ([b6fd433](https://git.gosuslugi.local///commit/b6fd4339b4e6a72478b2a1ac21618e409fd1a7e0))
- исправлено получение таймслотов для паспорта РФ ([71200dd](https://git.gosuslugi.local///commit/71200dded78f8d449f6d2d4bbbe10c2afc02ac66))
- костыльная правка boolet(-a) ([c44e2d4](https://git.gosuslugi.local///commit/c44e2d49b7a720b9a339e14919d1abca9e686a52))
- обновил правило выхода их под сценария ([8d72cad](https://git.gosuslugi.local///commit/8d72cadb8edee5c060a1842ed22603da4d4d270e))
- обработал обращение к несуществующим полям. ([c02a8da](https://git.gosuslugi.local///commit/c02a8daa4095b64e48c30e53855cda297d0491d6))

### [0.0.1](https://git.gosuslugi.local///compare/v0.0.0...v0.0.1) (2020-09-15)

### Features

- add standard-version support [ref EPGUCORE-36712](<[d0f3685](https://git.gosuslugi.local///commit/d0f3685ca3a62a4f06c91e6bc5f89f9e7ae918b4)>)

## 0.0.0 (2020-09-15)

### Features

- [ref EPGUCORE-36712] update epgu-lib to latest version, remove unsupported virtualScroll prop for lib-lookup ([bb62776](https://git.gosuslugi.local///commit/bb62776d07ecb1a3cc5e47b363a1df77f09d080b))
- add view and styles of component requirements-list [ref feature/EPGU-252](<[3baf5bf](https://git.gosuslugi.local///commit/3baf5bf6aa5a7fdaa51867e567fb735d98a55e55)>)
- add view and styles of component requirements-list [ref feature/EPGU-252](<[b743c78](https://git.gosuslugi.local///commit/b743c78548a6196d7fbe9a90e441019aab1ff443)>)
