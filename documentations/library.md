## Структура каталогов и файлов

Приложение обёрнуто в Angular библиотеку, для того что бы поставляться через npm, как зависимость.
Важные моменты.



1. Что бы установить библиотеку необходимо импортировать модуль и задать конфигурации
    ```
    import {ConstructorModule} from 'epgu-constructor';
    
    imports: [
     ConstructorModule.forRoot({
       serviceId: environment.serviceId,
       apiUrl: environment.apiUrl,
       dictionaryUrl: environment.dictionaryUrl
     })
    ]
    ```
2. Приложение содержит дополнительный файлы типа изображения, шрифты и так далее. 
Для корректной работы необходимо добавить их в приложение бутём раширения файла angular.json. 
    ```
    "assets": [
      "src/favicon.ico",
     {
       "***",
       "input": "dist/epgu-constructor/src/assets",
       "***"
     }
    ]
    ```
3. Сторонная библиотека epgu-lib требует дополнительных зависимостей которые хранятся в ней поэтому 
добавим ссылоки на эти самые завивсомсти и для этого необходимо обновить файл приложение ```tsconfig.app.json```.
 ```
    "paths": {
      "@ifc/plugin": ["node_modules/epgu-lib/assets/vendor/ifcplugin-lib.js"],
      "@ifc/common": ["node_modules/epgu-lib/assets/vendor/ifccommon-lib.js"]
    }
```
