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
