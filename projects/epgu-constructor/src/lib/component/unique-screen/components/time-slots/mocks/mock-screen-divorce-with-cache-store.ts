/* eslint-disable max-len */
export const mockScreenDivorceWithCacheStore = {
  serviceCode: '10000000106',
  targetCode: '-10000000106',
  orderId: 123,
  currentScenarioId: 1,
  serviceDescriptorId: '10000000106',
  currentUrl: 'http://local.test.gosuslugi.ru:4200/',
  finishedAndCurrentScreens: ['finishscreen20_book_reject', 's17_slots_const'],
  cachedAnswers: {
    w1: { visited: true, value: '' },
    q1: { visited: true, value: 'Решение суда о расторжении брака' },
    q4: { visited: true, value: 'Раздельно' },
    q3_2: { visited: true, value: 'По месту постоянной регистрации' },
    d3: { visited: true, value: '' },
    pd1: {
      visited: true,
      value:
        '{"states":[{"groupName":"Иванов Александр Николаевич","fields":[{"label":"Дата рождения:","value":"03.01.1980"}]},{"groupName":"Паспорт гражданина РФ","fields":[{"label":"Серия и номер:","value":"1234 123456"},{"label":"Дата выдачи:","value":"01.01.2001"},{"label":"Кем выдан:","value":"2 ГОМ г.Одинцово Московской области"},{"label":"Код подразделения:","value":"123-456"},{"label":"Место рождения:","value":"Г. Одинцово Московской области"}]}],"storedValues":{"firstName":"Asd","lastName":"Asd","middleName":"Asd","birthDate":"01.01.1980","birthPlace":"Г. Одинцово Московской области","gender":"M","docType":"RF_PASSPORT","rfPasportSeries":"1234","rfPasportNumber":"123456","rfPasportIssueDate":"03.03.2001","rfPasportIssuedBy":"2 ГОМ г.Одинцово Московской области","rfPasportIssuedById":"123456","rfPasportIssuedByIdFormatted":"123-456","citizenship":"РОССИЯ","citizenshipCode":"RUS"},"errors":[{"icon":"yellow-line","type":"warn","title":"Место рождения указано как в паспорте?","desc":"Если нет, в услуге откажут.<br><a id=\'howto\'>Как отредактировать данные</a>"}]}',
    },
    pd2: { visited: true, value: '+7(916)1234567' },
    pd3: { visited: true, value: 'asd@ya.ru' },
    pd4: {
      visited: true,
      value:
        '{"regAddr":{"cityType":"город","streetShortType":"пр-кт","additionalStreetShortType":"","postalCode":null,"districtType":"","geoLat":"54.3899597","building2Type":"","okato":"73401368000","building1Type":"","regionType":"область","additionalStreet":"","lat":"54.3899597","apartmentCheckboxClosed":false,"houseCheckboxClosed":false,"streetType":"проспект","town":"","lng":"48.5781578","index":"432064","townShortType":"","district":"","fullAddress":"432064, обл. Ульяновская, г. Ульяновск, пр-кт. Генерала Тюленева, д. 44, кв. 157","houseCheckbox":false,"region":"Ульяновская","geoLon":"48.5781578","additionalArea":"","apartmentType":"квартира","city":"Ульяновск","apartmentShortType":"кв","house":"44","apartmentCheckbox":false,"townType":"","additionalAreaType":"","regionShortType":"обл","regionCode":"73","districtShortType":"","street":"Генерала Тюленева","additionalStreetType":"","inCityDistShortType":"","additionalAreaShortType":"","cityShortType":"г","kladrCode":"7300000100007980040","building1ShortType":"","fiasCode":"1e59aa88-09ff-4da0-8830-a264b74a4082","hasErrors":0,"inCityDistType":"","houseType":"дом","inCityDist":"","addressStr":"обл. Ульяновская, г. Ульяновск, пр-кт. Генерала Тюленева","building1":"","building2":"","houseShortType":"д","building2ShortType":"","apartment":"157"}}',
    },
    act3: { visited: true, value: '2001-08-11T00:00:00.000+04:00' },
    act2: { visited: true, value: '562' },
    act4: {
      visited: true,
      value:
        '{"originalItem":{"value":"R7300002","parentValue":null,"title":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","isLeaf":true,"children":[],"attributes":[{"name":"PR4","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR5","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR6","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR7","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"CITE","type":"STRING","value":{"asString":"www.zags.ulgov.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"www.zags.ulgov.ru"},"valueAsOfType":"www.zags.ulgov.ru"},{"name":"DATAN","type":"STRING","value":{"asString":"2017-02-01","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"2017-02-01"},"valueAsOfType":"2017-02-01"},{"name":"DATAK","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"CODE","type":"STRING","value":{"asString":"R7300002","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"R7300002"},"valueAsOfType":"R7300002"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"valueAsOfType":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},"valueAsOfType":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},{"name":"PHONE","type":"STRING","value":{"asString":"(8422) 27-42-55","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"(8422) 27-42-55"},"valueAsOfType":"(8422) 27-42-55"},{"name":"EMAIL","type":"STRING","value":{"asString":"zavolga@ulzags.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"zavolga@ulzags.ru"},"valueAsOfType":"zavolga@ulzags.ru"},{"name":"OKTMO","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR1","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR2","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR3","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"INN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"OGRN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR8","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR9","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"}],"source":null,"attributeValues":{"OKTMO":null,"PHONE":"(8422) 27-42-55","CITE":"www.zags.ulgov.ru","INN":null,"EMAIL":"zavolga@ulzags.ru","PR1":"true","PR3":"true","OGRN":null,"PR2":"true","PR5":"true","CODE":"R7300002","PR4":"true","PR7":"true","PR6":"true","PR9":"false","ADDRESS":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","PR8":"false","DATAN":"2017-02-01","DATAK":null,"FULLNAME":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"}},"id":"R7300002","text":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"}',
    },
    cd1: {
      visited: true,
      value: 'Мировой суд судебный участок №6 Заволжского судебного района города Ульяновска',
    },
    cd2: { visited: true, value: '2021-01-11T00:00:00.000+04:00' },
    fai1: { visited: true, value: '' },
    fai2: { visited: true, value: '' },
    fai3: { visited: true, value: '' },
    pd11: { visited: true, value: '1' },
    pd5: { visited: true, value: 'Новоженина' },
    pd15: { visited: true, value: '' },
    pd12: { visited: true, value: 'Новоженин' },
    pd18: { visited: true, value: 'Михаил' },
    pd19: { visited: true, value: 'Николаевич' },
    pd20: { visited: true, value: '1979-09-07T00:00:00.000+04:00' },
    ms1: {
      visited: true,
      value:
        '{"value":"R7300002","parentValue":null,"title":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","isLeaf":true,"children":null,"attributes":[{"name":"PR4","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR5","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR6","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR7","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"CITE","type":"STRING","value":{"asString":"www.zags.ulgov.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"www.zags.ulgov.ru"},"valueAsOfType":"www.zags.ulgov.ru"},{"name":"DATAN","type":"STRING","value":{"asString":"2017-02-01","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"2017-02-01"},"valueAsOfType":"2017-02-01"},{"name":"DATAK","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"CODE","type":"STRING","value":{"asString":"R7300002","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"R7300002"},"valueAsOfType":"R7300002"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"valueAsOfType":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},"valueAsOfType":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},{"name":"PHONE","type":"STRING","value":{"asString":"(8422) 27-42-55","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"(8422) 27-42-55"},"valueAsOfType":"(8422) 27-42-55"},{"name":"EMAIL","type":"STRING","value":{"asString":"zavolga@ulzags.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"zavolga@ulzags.ru"},"valueAsOfType":"zavolga@ulzags.ru"},{"name":"OKTMO","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR1","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR2","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR3","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"INN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"OGRN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR8","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR9","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"}],"source":null,"attributeValues":{"OKTMO":null,"PHONE":"(8422) 27-42-55","CITE":"www.zags.ulgov.ru","INN":null,"EMAIL":"zavolga@ulzags.ru","PR1":"true","PR3":"true","OGRN":null,"PR2":"true","PR5":"true","CODE":"R7300002","PR4":"true","PR7":"true","PR6":"true","PR9":"false","ADDRESS":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","PR8":"false","DATAN":"2017-02-01","DATAK":null,"FULLNAME":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"idForMap":19,"center":[48.545443,54.362138],"baloonContent":[{"value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","label":"Адрес"},{"value":"(8422) 27-42-55","label":"Телефон"},{"value":"zavolga@ulzags.ru","label":"Email"}],"agreement":true,"expanded":true,"okato":"73401368000"}',
    },
    ts1: {
      visited: true,
      value:
        '{"bookId":"40d64a81-846d-4f71-b71a-310b9f146df6","esiaId":"242936855","status":{"statusCode":201,"statusMessage":"Забронировано"},"timeSlot":{"slotId":"131950803","serviceId":"a","organizationId":"R7300002","areaId":"a","visitTime":1622104200000,"visitTimeStr":"2021-05-27T11:30:00.000","visitTimeISO":"2021-05-27T11:30:00+03:00","attributes":[]},"department":{"value":"R7300002","title":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","isLeaf":true,"attributes":[{"name":"PR4","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR5","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR6","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR7","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"CITE","type":"STRING","value":{"asString":"www.zags.ulgov.ru","typeOfValue":"STRING","value":"www.zags.ulgov.ru"},"valueAsOfType":"www.zags.ulgov.ru"},{"name":"DATAN","type":"STRING","value":{"asString":"2017-02-01","typeOfValue":"STRING","value":"2017-02-01"},"valueAsOfType":"2017-02-01"},{"name":"DATAK","type":"STRING","value":{"typeOfValue":"STRING"}},{"name":"CODE","type":"STRING","value":{"asString":"R7300002","typeOfValue":"STRING","value":"R7300002"},"valueAsOfType":"R7300002"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","typeOfValue":"STRING","value":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"valueAsOfType":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","typeOfValue":"STRING","value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},"valueAsOfType":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},{"name":"PHONE","type":"STRING","value":{"asString":"(8422) 27-42-55","typeOfValue":"STRING","value":"(8422) 27-42-55"},"valueAsOfType":"(8422) 27-42-55"},{"name":"EMAIL","type":"STRING","value":{"asString":"zavolga@ulzags.ru","typeOfValue":"STRING","value":"zavolga@ulzags.ru"},"valueAsOfType":"zavolga@ulzags.ru"},{"name":"OKTMO","type":"STRING","value":{"typeOfValue":"STRING"}},{"name":"PR1","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR2","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR3","type":"STRING","value":{"asString":"true","typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"INN","type":"STRING","value":{"typeOfValue":"STRING"}},{"name":"OGRN","type":"STRING","value":{"typeOfValue":"STRING"}},{"name":"PR8","type":"STRING","value":{"asString":"false","typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR9","type":"STRING","value":{"asString":"false","typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"}],"attributeValues":{"PHONE":"(8422) 27-42-55","CITE":"www.zags.ulgov.ru","EMAIL":"zavolga@ulzags.ru","PR1":"true","PR3":"true","PR2":"true","PR5":"true","CODE":"R7300002","PR4":"true","PR7":"true","PR6":"true","PR9":"false","ADDRESS":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","PR8":"false","DATAN":"2017-02-01","FULLNAME":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"idForMap":19,"center":[48.545443,54.362138],"baloonContent":[{"value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","label":"Адрес"},{"value":"(8422) 27-42-55","label":"Телефон"},{"value":"zavolga@ulzags.ru","label":"Email"}],"agreement":true,"expanded":true,"okato":"73401368000"},"currentTime":"2021-04-23T18:20:24.948Z","timeStart":"2021-04-23T18:20:24.948Z","timeFinish":"2021-04-24T18:20:24.948Z","timeExpired":true}',
    },
    booktimer1: { visited: true, value: 'Оплатить' },
    pay1ms1: {
      visited: true,
      value:
        '{"uin":"0316373323042021019653877","amount":"455","amountWithoutDiscount":"650","paymentPurpose":"Госпошлина за государственную регистрацию расторжения брака","receiver":"CНИЛС 13507371744","billId":10952402337}',
    },
    sentTime: { value: '2021-05-04T12:08:31+03:00' },
  },
  currentValue: {},
  errors: {},
  applicantAnswers: {
    pd5: { visited: true, value: 'Новоженина' },
    pd4: {
      visited: true,
      value:
        '{"regAddr":{"cityType":"город","streetShortType":"пр-кт","additionalStreetShortType":"","postalCode":null,"districtType":"","geoLat":"54.3899597","building2Type":"","okato":"73401368000","building1Type":"","regionType":"область","additionalStreet":"","lat":"54.3899597","apartmentCheckboxClosed":false,"houseCheckboxClosed":false,"streetType":"проспект","town":"","lng":"48.5781578","index":"432064","townShortType":"","district":"","fullAddress":"432064, обл. Ульяновская, г. Ульяновск, пр-кт. Генерала Тюленева, д. 44, кв. 157","houseCheckbox":false,"region":"Ульяновская","geoLon":"48.5781578","additionalArea":"","apartmentType":"квартира","city":"Ульяновск","apartmentShortType":"кв","house":"44","apartmentCheckbox":false,"townType":"","additionalAreaType":"","regionShortType":"обл","regionCode":"73","districtShortType":"","street":"Генерала Тюленева","additionalStreetType":"","inCityDistShortType":"","additionalAreaShortType":"","cityShortType":"г","kladrCode":"7300000100007980040","building1ShortType":"","fiasCode":"1e59aa88-09ff-4da0-8830-a264b74a4082","hasErrors":0,"inCityDistType":"","houseType":"дом","inCityDist":"","addressStr":"обл. Ульяновская, г. Ульяновск, пр-кт. Генерала Тюленева","building1":"","building2":"","houseShortType":"д","building2ShortType":"","apartment":"157"}}',
    },
    pd20: { visited: true, value: '1979-09-07T00:00:00.000+04:00' },
    fai3: { visited: true, value: '' },
    ms1: {
      visited: true,
      value:
        '{"value":"R7300002","parentValue":null,"title":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","isLeaf":true,"children":null,"attributes":[{"name":"PR4","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR5","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR6","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR7","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"CITE","type":"STRING","value":{"asString":"www.zags.ulgov.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"www.zags.ulgov.ru"},"valueAsOfType":"www.zags.ulgov.ru"},{"name":"DATAN","type":"STRING","value":{"asString":"2017-02-01","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"2017-02-01"},"valueAsOfType":"2017-02-01"},{"name":"DATAK","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"CODE","type":"STRING","value":{"asString":"R7300002","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"R7300002"},"valueAsOfType":"R7300002"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"valueAsOfType":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},"valueAsOfType":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},{"name":"PHONE","type":"STRING","value":{"asString":"(8422) 27-42-55","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"(8422) 27-42-55"},"valueAsOfType":"(8422) 27-42-55"},{"name":"EMAIL","type":"STRING","value":{"asString":"zavolga@ulzags.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"zavolga@ulzags.ru"},"valueAsOfType":"zavolga@ulzags.ru"},{"name":"OKTMO","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR1","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR2","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR3","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"INN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"OGRN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR8","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR9","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"}],"source":null,"attributeValues":{"OKTMO":null,"PHONE":"(8422) 27-42-55","CITE":"www.zags.ulgov.ru","INN":null,"EMAIL":"zavolga@ulzags.ru","PR1":"true","PR3":"true","OGRN":null,"PR2":"true","PR5":"true","CODE":"R7300002","PR4":"true","PR7":"true","PR6":"true","PR9":"false","ADDRESS":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","PR8":"false","DATAN":"2017-02-01","DATAK":null,"FULLNAME":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"idForMap":19,"center":[48.545443,54.362138],"baloonContent":[{"value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","label":"Адрес"},{"value":"(8422) 27-42-55","label":"Телефон"},{"value":"zavolga@ulzags.ru","label":"Email"}],"agreement":true,"expanded":true,"okato":"73401368000"}',
    },
    fai2: { visited: true, value: '' },
    act3: { visited: true, value: '2001-08-11T00:00:00.000+04:00' },
    fai1: { visited: true, value: '' },
    act2: { visited: true, value: '562' },
    d3: { visited: true, value: '' },
    act4: {
      visited: true,
      value:
        '{"originalItem":{"value":"R7300002","parentValue":null,"title":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","isLeaf":true,"children":[],"attributes":[{"name":"PR4","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR5","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR6","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR7","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"CITE","type":"STRING","value":{"asString":"www.zags.ulgov.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"www.zags.ulgov.ru"},"valueAsOfType":"www.zags.ulgov.ru"},{"name":"DATAN","type":"STRING","value":{"asString":"2017-02-01","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"2017-02-01"},"valueAsOfType":"2017-02-01"},{"name":"DATAK","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"CODE","type":"STRING","value":{"asString":"R7300002","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"R7300002"},"valueAsOfType":"R7300002"},{"name":"FULLNAME","type":"STRING","value":{"asString":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},"valueAsOfType":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"},{"name":"ADDRESS","type":"STRING","value":{"asString":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},"valueAsOfType":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78"},{"name":"PHONE","type":"STRING","value":{"asString":"(8422) 27-42-55","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"(8422) 27-42-55"},"valueAsOfType":"(8422) 27-42-55"},{"name":"EMAIL","type":"STRING","value":{"asString":"zavolga@ulzags.ru","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"zavolga@ulzags.ru"},"valueAsOfType":"zavolga@ulzags.ru"},{"name":"OKTMO","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR1","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR2","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"PR3","type":"STRING","value":{"asString":"true","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"true"},"valueAsOfType":"true"},{"name":"INN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"OGRN","type":"STRING","value":{"asString":null,"asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":null},"valueAsOfType":null},{"name":"PR8","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"},{"name":"PR9","type":"STRING","value":{"asString":"false","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"false"},"valueAsOfType":"false"}],"source":null,"attributeValues":{"OKTMO":null,"PHONE":"(8422) 27-42-55","CITE":"www.zags.ulgov.ru","INN":null,"EMAIL":"zavolga@ulzags.ru","PR1":"true","PR3":"true","OGRN":null,"PR2":"true","PR5":"true","CODE":"R7300002","PR4":"true","PR7":"true","PR6":"true","PR9":"false","ADDRESS":"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78","PR8":"false","DATAN":"2017-02-01","DATAK":null,"FULLNAME":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"}},"id":"R7300002","text":"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области"}',
    },
    ts2: { value: '{"timeExpired":true}' },
    ts4: { value: '{"timeExpired":true}' },
    ts3: { value: '{"timeExpired":true}' },
    w1: { visited: true, value: '' },
    state15: { value: 'true' },
    q1: { visited: true, value: 'Решение суда о расторжении брака' },
    pd11: { visited: true, value: '1' },
    q3_2: { visited: true, value: 'По месту постоянной регистрации' },
    pd12: { visited: true, value: 'Новоженин' },
    q4: { visited: true, value: 'Раздельно' },
    pay1ms1: {
      visited: true,
      value:
        '{"uin":"0316373323042021019653877","amount":"455","amountWithoutDiscount":"650","paymentPurpose":"Госпошлина за государственную регистрацию расторжения брака","receiver":"CНИЛС 13507371744","billId":10952402337}',
    },
    booktimer1: { visited: true, value: 'Оплатить' },
    pd19: { visited: true, value: 'Николаевич' },
    pd15: { visited: true, value: '' },
    pd18: { visited: true, value: 'Михаил' },
    cd2: { visited: true, value: '2021-01-11T00:00:00.000+04:00' },
    cd1: {
      visited: true,
      value: 'Мировой суд судебный участок №6 Заволжского судебного района города Ульяновска',
    },
    sentTime: { value: '2021-05-04T12:08:31+03:00' },
    pd1: {
      visited: true,
      value:
        '{"states":[{"groupName":"Иванов Александр Николаевич","fields":[{"label":"Дата рождения:","value":"03.01.1980"}]},{"groupName":"Паспорт гражданина РФ","fields":[{"label":"Серия и номер:","value":"4606 123456"},{"label":"Дата выдачи:","value":"03.03.2003"},{"label":"Кем выдан:","value":"2 ГОМ г.Одинцово Московской области"},{"label":"Код подразделения:","value":"123-456"},{"label":"Место рождения:","value":"Г. Одинцово Московской области"}]}],"storedValues":{"firstName":"Александр","lastName":"Иванов","middleName":"Николаевич","birthDate":"03.01.1980","birthPlace":"Г. Одинцово Московской области","gender":"M","docType":"RF_PASSPORT","rfPasportSeries":"4606","rfPasportNumber":"123456","rfPasportIssueDate":"03.03.2003","rfPasportIssuedBy":"2 ГОМ г.Одинцово Московской области","rfPasportIssuedById":"503065","rfPasportIssuedByIdFormatted":"123-456","citizenship":"РОССИЯ","citizenshipCode":"RUS"},"errors":[{"icon":"yellow-line","type":"warn","title":"Место рождения указано как в паспорте?","desc":"Если нет, в услуге откажут.<br><a id=\'howto\'>Как отредактировать данные</a>"}]}',
    },
    pd3: { visited: true, value: 'asd@ya.ru' },
    pd2: { visited: true, value: '+7(916)1234567' },
    book_reject1: { visited: true, value: 'Выбрать дату' },
  },
  cycledApplicantAnswers: { answerlist: [] },
  participants: {},
  display: {
    id: 's17_slots_const',
    name: 'Выбор даты и времени для пост. регистрации',
    type: 'UNIQUE',
    header: 'Выберите дату и время',
    components: [
      {
        id: 'ts1',
        name: '',
        type: 'TimeSlotWithComputableDepartment',
        label: '',
        attrs: {
          cancelReservation: ['ts2', 'ts3'],
          timePeriodInMinutes: '1440',
          timerCode: 'Booking24h',
          timeSlotType: { type: 'CONST', value: 'RAZBRAK' },
          department: { type: 'REF', value: 'ms1' },
          refDate: '2021-01-11T00:00:00.000+04:00',
          dateType: 'refDate',
          refs: { refDate: 'cd2.value' },
          restrictions: { minDate: [33, 'd'] },
        },
        linkedValues: [
          {
            argument: 'calculatedDepartment',
            jsonLogic: {
              if: [
                {
                  or: [
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Взаимное согласие'] },
                        { '==': ['answer.q2.value', 'Да'] },
                        { '==': ['answer.q3.value', 'По месту постоянной регистрации'] },
                      ],
                    },
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Решение суда о расторжении брака'] },
                        { '==': ['answer.q3_2.value', 'По месту постоянной регистрации'] },
                      ],
                    },
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Решение суда о расторжении брака'] },
                        { '==': ['answer.q3_3.value', 'По месту постоянной регистрации'] },
                      ],
                    },
                  ],
                },
                'ms1',
                {
                  or: [
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Взаимное согласие'] },
                        { '==': ['answer.q2.value', 'Да'] },
                        { '==': ['answer.q3.value', 'По месту временной регистрации'] },
                      ],
                    },
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Решение суда о расторжении брака'] },
                        { '==': ['answer.q3_2.value', 'По месту временной регистрации'] },
                      ],
                    },
                    {
                      and: [
                        { '==': ['answer.q1.value', 'Решение суда о расторжении брака'] },
                        { '==': ['answer.q3_3.value', 'По месту временной регистрации'] },
                      ],
                    },
                  ],
                },
                'ms2',
                'ms3',
              ],
            },
            jsonSource: false,
          },
          {
            argument: 'dateType',
            jsonLogic: {
              if: [
                { '==': ['answer.q1.value', 'Решение суда о расторжении брака'] },
                'refDate',
                'today',
              ],
            },
            jsonSource: false,
          },
        ],
        arguments: { calculatedDepartment: 'ms1', dateType: 'refDate' },
        value:
          '{"timeSlotType":"RAZBRAK","department":"{\\"value\\":\\"R7300002\\",\\"parentValue\\":null,\\"title\\":\\"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области\\",\\"isLeaf\\":true,\\"children\\":null,\\"attributes\\":[{\\"name\\":\\"PR4\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"PR5\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"PR6\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"PR7\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"CITE\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"www.zags.ulgov.ru\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"www.zags.ulgov.ru\\"},\\"valueAsOfType\\":\\"www.zags.ulgov.ru\\"},{\\"name\\":\\"DATAN\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"2017-02-01\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"2017-02-01\\"},\\"valueAsOfType\\":\\"2017-02-01\\"},{\\"name\\":\\"DATAK\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":null,\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":null},\\"valueAsOfType\\":null},{\\"name\\":\\"CODE\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"R7300002\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"R7300002\\"},\\"valueAsOfType\\":\\"R7300002\\"},{\\"name\\":\\"FULLNAME\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области\\"},\\"valueAsOfType\\":\\"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области\\"},{\\"name\\":\\"ADDRESS\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78\\"},\\"valueAsOfType\\":\\"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78\\"},{\\"name\\":\\"PHONE\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"(8422) 27-42-55\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"(8422) 27-42-55\\"},\\"valueAsOfType\\":\\"(8422) 27-42-55\\"},{\\"name\\":\\"EMAIL\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"zavolga@ulzags.ru\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"zavolga@ulzags.ru\\"},\\"valueAsOfType\\":\\"zavolga@ulzags.ru\\"},{\\"name\\":\\"OKTMO\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":null,\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":null},\\"valueAsOfType\\":null},{\\"name\\":\\"PR1\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"PR2\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"PR3\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"true\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"true\\"},\\"valueAsOfType\\":\\"true\\"},{\\"name\\":\\"INN\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":null,\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":null},\\"valueAsOfType\\":null},{\\"name\\":\\"OGRN\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":null,\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":null},\\"valueAsOfType\\":null},{\\"name\\":\\"PR8\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"false\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"false\\"},\\"valueAsOfType\\":\\"false\\"},{\\"name\\":\\"PR9\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"false\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"false\\"},\\"valueAsOfType\\":\\"false\\"}],\\"source\\":null,\\"attributeValues\\":{\\"OKTMO\\":null,\\"PHONE\\":\\"(8422) 27-42-55\\",\\"CITE\\":\\"www.zags.ulgov.ru\\",\\"INN\\":null,\\"EMAIL\\":\\"zavolga@ulzags.ru\\",\\"PR1\\":\\"true\\",\\"PR3\\":\\"true\\",\\"OGRN\\":null,\\"PR2\\":\\"true\\",\\"PR5\\":\\"true\\",\\"CODE\\":\\"R7300002\\",\\"PR4\\":\\"true\\",\\"PR7\\":\\"true\\",\\"PR6\\":\\"true\\",\\"PR9\\":\\"false\\",\\"ADDRESS\\":\\"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78\\",\\"PR8\\":\\"false\\",\\"DATAN\\":\\"2017-02-01\\",\\"DATAK\\":null,\\"FULLNAME\\":\\"Отдел ЗАГС по Заволжскому району города Ульяновска Агентства ЗАГС Ульяновской области\\"},\\"idForMap\\":19,\\"center\\":[48.545443,54.362138],\\"baloonContent\\":[{\\"value\\":\\"Российская Федерация, Ульяновская область, г. Ульяновск, ул. Брестская, д. 78\\",\\"label\\":\\"Адрес\\"},{\\"value\\":\\"(8422) 27-42-55\\",\\"label\\":\\"Телефон\\"},{\\"value\\":\\"zavolga@ulzags.ru\\",\\"label\\":\\"Email\\"}],\\"agreement\\":true,\\"expanded\\":true,\\"okato\\":\\"73401368000\\"}","orderId":763942282,"userId":"1000466480","waitingTimeExpired":true,"bookingRequestParams":[{"name":"pacientname"},{"name":"doctorname"},{"name":"doctor"},{"name":"anotherperson"},{"name":"doctorid"},{"name":"ageperson"},{"name":"genderperson"}]}',
        required: true,
      },
    ],
    buttons: [{ label: 'Продолжить', type: 'nextStep', action: 'getNextScreen' }],
    hideBackButton: false,
    infoComponents: [],
    firstScreen: false,
    impasse: false,
    accepted: true,
    terminal: false,
  },
  logicComponents: [],
  serviceInfo: {
    department: {
      id: '10000038220',
      title: 'Региональные органы власти в сфере записи актов гражданского состояния',
    },
    error: 'Region not found',
    userRegion: {
      name: 'Московская область',
      path: 'Московская область',
      codes: ['46000000000'],
    },
    statusId: 0,
  },
  signInfoMap: {},
  attachmentInfo: {},
  additionalParameters: {
    orderId: '1174417292',
    oid: '242936855',
    snils: '135-073-717 44',
    firstName: 'Александр',
    lastName: 'Иванов',
    middleName: 'Николаевич',
    birthDate: '03.01.1980',
    gender: 'M',
    citizenship: 'РОССИЯ',
    citizenshipCode: 'RUS',
    serviceId: '10000000106',
    targetId: '-10000000106',
    timezone: '+3',
    masterId: '1174417292',
    masterOid: '242936855',
    masterSnils: '135-073-717 44',
    masterFirstName: 'Александр',
    masterLastName: 'Иванов',
    masterMiddleName: 'Николаевич',
    masterBirthDate: '03.01.1980',
    masterGender: 'M',
    masterCitizenship: 'РОССИЯ',
    masterCitizenshipCode: 'RUS',
    masterTimezone: '+3',
  },
  serviceParameters: {},
  generatedFiles: ['req_preview.pdf', 'req_7e072f53-491b-4650-bf43-e1e968dfc87a.xml'],
  cycledApplicantAnswerContext: {},
  gender: 'M',
};
