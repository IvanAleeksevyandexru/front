## Структура каталогов и файлов

Для установки epgu-constructor необходимо выполнить следующее.
1. Положить файлы в node-modules 
    >
        epgu-lib, epgu-constructor

2. Установить зависимости для epgu-lib и epgu-constructor 
    > 
        npm i moment@^2.27.0 angular2-text-mask@^9.0.0 @ngx-translate/core@^13.0.0 ngx-perfect-scrollbar@^10.0.1 @ngx-translate/http-loader@^6.0.0 ngx-webcam@^0.3.0 @angular/cdk@~9.0.1 ngx-cookie-service@^10.0.1 ru-validation-codes@^2.8.0 text-mask-core 
3. Установить ссылки на зависиомсти необходимые для epgu-lib
    > 
        "@ifc/plugin": ["node_modules/epgu-lib/assets/vendor/ifcplugin-lib.js"],
        "@ifc/common": ["node_modules/epgu-lib/assets/vendor/ifccommon-lib.js"]
4. отключаю IVY
    >
        "angularCompilerOptions": {
             "enableIvy": false
        }

5. Встриваем приложение
    >
        Встраиваем в модуль
        FormPlayerModule.forRoot({
            apiUrl: ‘http://188.93.23.27:18080/api’,
            dictionaryUrl: ‘https://pgu-dev-fed.test.gosuslugi.ru/api/nsi/v1/dictionary’,
            externalApiUrl: ‘https://pgu-dev-fed.test.gosuslugi.ru/api/nsi/v1’,
            timeSlotApiUrl: ‘https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/equeue/agg’,
            uinApiUrl: ‘https://pgu-dev-fed.test.gosuslugi.ru/api/lk/v1/paygate/uin’,
            billsApiUrl: ‘https://pgu-dev-fed.test.gosuslugi.ru/api/pay/v1/bills’,
            yandexMapsApiKey: ‘9e8e2fc4-5970-4ca6-95c5-3e620095e8e3’,
            lkUrl: ‘https://pgu-dev-lk.test.gosuslugi.ru/info’,
            paymentUrl: ‘https://payment-dev-l14.test.gosuslugi.ru’,
            fileUploadApiUrl: ‘https://gosuslugi.ru/api/storage/v1/files’
        }),
        Встраиваем в html
        <epgu-constructor-form-player
        [serviceId]=“serviceId”
        [targetId]=“targetId”
        ></epgu-constructor-form-player>
        
        Добавляем в html
        serviceId = ‘10000056555’;
        targetId = ‘10000006704’;
        
6. Добавляем 
    >
        {
            "glob": "**/*",
            "input": "./node_modules/epgu-constructor/src/assets",
            "output": "assets"
          },
          {
            "glob": "**/*",
            "input": "./node_modules/epgu-lib/assets/",
            "output": "./lib-assets"
          }
