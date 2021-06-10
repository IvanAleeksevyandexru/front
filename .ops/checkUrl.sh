#!/bin/sh

if [ "$orderId" != '' ]; then
        sed -i "s@orderId: ['\`].*['\`]@""orderId: '$orderId'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$targetId" != '' ]; then
        sed -i "s@targetId: ['\`].*['\`]@""targetId: '$targetId'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$serviceId" != '' ]; then
        sed -i "s@serviceId: ['\`].*['\`]@""serviceId: '$serviceId'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$production" != '' ]; then
        sed -i "s@production: ['\`].*['\`]@""production: '$production'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$apiUrl" != '' ]; then
        sed -i "s@apiUrl: ['\`].*['\`]@""apiUrl: '$apiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$dictionaryUrl" != '' ]; then
        sed -i "s@dictionaryUrl: ['\`].*['\`]@""dictionaryUrl: '$dictionaryUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$externalApiUrl" != '' ]; then
        sed -i "s@externalApiUrl: ['\`].*['\`]@""externalApiUrl: '$externalApiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$timeSlotApiUrl" != '' ]; then
        sed -i "s@timeSlotApiUrl: ['\`].*['\`]@""timeSlotApiUrl: '$timeSlotApiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$uinApiUrl" != '' ]; then
        sed -i "s@uinApiUrl: ['\`].*['\`]@""uinApiUrl: '$uinApiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$billsApiUrl" != '' ]; then
        sed -i "s@billsApiUrl: ['\`].*['\`]@""billsApiUrl: '$billsApiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$yandexMapsApiKey" != '' ]; then
        sed -i "s@yandexMapsApiKey: ['\`].*['\`]@""yandexMapsApiKey: '$yandexMapsApiKey'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$lkUrl" != '' ]; then
        sed -i "s@lkUrl: ['\`].*['\`]@""lkUrl: '$lkUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$paymentUrl" != '' ]; then
        sed -i "s@paymentUrl: ['\`].*['\`]@""paymentUrl: '$paymentUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$fileUploadApiUrl" != '' ]; then
        sed -i "s@fileUploadApiUrl: ['\`].*['\`]@""fileUploadApiUrl: '$fileUploadApiUrl'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$staticDomainAssetsPath" != '' ]; then
        sed -i "s@staticDomainAssetsPath: ['\`].*['\`]@""staticDomainAssetsPath: '$staticDomainAssetsPath'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$staticDomainLibAssetsPath" != '' ]; then
        sed -i "s@staticDomainLibAssetsPath: ['\`].*['\`]@""staticDomainLibAssetsPath: '$staticDomainLibAssetsPath'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$mocks" != '' ]; then
        sed -i "s@mocks: ['\`].*['\`]@""mocks: '$mocks'"'@' /usr/share/nginx/html/main-es5.js
fi

if [ "$mockUrl" != '' ]; then
        sed -i "s@mockUrl: ['\`].*['\`]@""mockUrl: '$mockUrl'"'@' /usr/share/nginx/html/main-es5.js
fi
