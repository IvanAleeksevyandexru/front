#!/bin/sh

if [ "$apiUrl" != '' ]; then
        sed -i "s@apiUrl: '.*'@""apiUrl: '$apiUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$dictionaryUrl" != '' ]; then
        sed -i "s@dictionaryUrl: '.*'@""dictionaryUrl: '$dictionaryUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$externalApiUrl" != '' ]; then
        sed -i "s@externalApiUrl: '.*'@""externalApiUrl: '$externalApiUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$timeSlotApiUrl" != '' ]; then
        sed -i "s@timeSlotApiUrl: '.*'@""timeSlotApiUrl: '$timeSlotApiUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$uinApiUrl" != '' ]; then
        sed -i "s@uinApiUrl: '.*'@""uinApiUrl: '$uinApiUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$billsApiUrl" != '' ]; then
        sed -i "s@billsApiUrl: '.*'@""billsApiUrl: '$billsApiUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$lkUrl" != '' ]; then
        sed -i "s@lkUrl: '.*'@""lkUrl: '$lkUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$paymentUrl" != '' ]; then
        sed -i "s@paymentUrl: '.*'@""paymentUrl: '$paymentUrl'"'@' /usr/share/nginx/html/main.js
fi

if [ "$fileUploadApiUrl" != '' ]; then
        sed -i "s@fileUploadApiUrl: '.*'@""fileUploadApiUrl: '$fileUploadApiUrl'"'@' /usr/share/nginx/html/main.js
fi
