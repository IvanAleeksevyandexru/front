# Release Notes

## [404.x.x](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v404.x.x) (2022-04-14)

### Features

* Добавляет в LkInvitationInput возможность последовательного приглашения [EPGUCORE-85587]
* Добавлен health на создание черновика / открытие черновика [EPGUCORE-87275]
* Добавлена верстка clarifications в RegistrationLegalAddr [EPGUCORE-86024]
* Добавлен SlotsErrorHandling для TimeSlot2 [EPGUCORE-92232]
* Добавлен minOccures в childrenList [EPGUCORE-91135]
* Добавлена возможность валидации даты по DateInput в DocInput [EPGUCORE-89680]
* Добавлен interceptor по закрытию услуг по куке [EPGUCORE-91360]
* Реализовать аналог confirmModalStep в кнопках компонента QuestionScr [EPGUCORE-86551]
* Доработка CheckBox внутри RepeatableFields [EPGUCORE-76749]
* Обновлена отправка хелсов создания и редактирования orderId [EPGUCORE-87275]
* Добавлен параметр uinVisible для UnusedPayments BillInfo PaymentScr [EPGUCORE-92494]

### Refactor

* Обновление шрифтов Lato-Regular.woff2 и Lato-Bold.woff2 [EPGUCORE-93080]
* Перенесены часть методов из SelectMapObjectService в KindergartenService [EPGUCORE-85316]
* Поправлены процедуры клонирования и сравнивания объектов [EPGUCORE-93739]
* Убран дублирующий параметр 'serviceVersions', в компоненте stand [EPGUCORE-95289]

### Bug Fixes

* Добавлена работа imgPrefixer pipe в InfoScreen [EPGUCORE-90030]
* Правка фокусировки на регион на карте [EPGUCORE-89831]
* Поправлена работа курсора в MaskedInput на мобильных устройствах [EPGUCORE-90970]
* Правка верстки(отступов) ViewComponent.scss [EPGUCORE-89823]
* Поправлена верстка в GroupItemComponent [EPGUCORE-89824]
* Убран лишний вертикальный отступ у картинок снизу на InfoScreen [EPGUCORE-91830]
* Убарн двойной скролл на экране приоритета садов [EPGUCORE-89321]
* Поправлено положение screen-buttons для mob [EPGUCORE-86209]
* Изменен текст ошибки для модалки на записи к врачу [EPGUCORE-88496]
* Правка вёрстки hint для registration-addr [EPGUCORE-89315]
* Очистка multi-choice-dictionary при смене фильтра (родительского значения) [EPGUCORE-91886]
* Реализация пустого экрана для модалки мультисписка [EPGUCORE-91918]
* Исправлена логика инита в list-pagination.service и добавлены тесты [EPGUCORE-92378]
* Добавлена очистка буфера в output-html [EPGUCORE-90915]
* Поправлен механизм обработки видимости screen-buttons [EPGUCORE-91815]
* Добавлен орг тип [EPGUCORE-87162]
* Добавлено очищение ошибки при выборе даты [EPGUCORE-88893]
* Убрано кеширование запроса докторов из timeSlotDoctors [EPGUCORE-88440]
* Правки валидации значения компонентов TextArea и SnilsInput и др. [EPGUCORE-87682]
* Поправлены счетчики при удаление suggest в FileUploadItem [EPGUCORE-90592]
* Исправлен парсинг даты в components-list-tools.service [EPGUCORE-89748]
* Поправлен loader у TimeSlot при Cancel [EPGUCORE-88604]
* Исправлены стили ранее выбранного элемента на карте [EPGUCORE-88426]
* Добавлено форматирование ext в названии файла [EPGUCORE-92213]
* Поправлена реактивность в Timeslot 2 [EPGUCORE-92835]
* Поправлен дефект, что не отображается виджет ПСО на страницах КФ [EPGUCORE-92825]
* Правка singleNotifier для отображения нескольких дисклеймеров [EPGUCORE-87879]
* Возвращен selectAttributes из json вместо [*] [EPGUCORE-84738]
* Убрана кнопка Посмотреть у txt [EPGUCORE-94572]
* Добавлена обработка строковый значений для readonly [EPGUCORE-92387]
* Исправлена карта на судах [EPGUCORE-92890]
* Сделана необязательной валидация ИНН [EPGUCORE-89532]
* Параллельные и последовательные запросы CarDetailInfo [EPGUCORE-94765]
* Изменены стили радиобаттнов для отображения в строку при коротких лейблах [EPGUCORE-91759]
* Исправлены конфликты с задваивающимся divider [EPGUCORE-89315]
* Исправление работы text transform директивы [EPGUCORE-95177]

### Tests

* Добавлены тесты в multipleChoiceDictionary, чтобы не было регреса [EPGUCORE-91566]

### Chore

* Добавлен проект component-registry [EPGUCORE-90942]
* Добавлены линки на стенды в versions [EPGUCORE-93907]
* Доработки в versions, теперь показываются версии бэковских сервисов [EPGUCORE-87386]
* Сборка переведена на кластерный сборочный агент

## [401.40.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v401.40.0) (2022-04-14)

### Bug Fixes

* Добавлена защита от кривого форматирования дадаты и неотрисовки пинов на карте [EPGUCORE-93815]

## [401.34.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v401.34.0) (2022-04-11)

### Features

* Добавлено использование компонента TimeSlot для услуг ПГС [EPGUCORE-67218]

### Bug Fixes

* Поправлен inviteService [EPGUCORE-93405]
* Исправлен дефект, что неверно формируется filter в запросе слотов при 25 статусе [EPGUCORE-90882]
* Доработан фильтр Lookup для 25 статуса по услугам [EPGUCORE-90231]

## [401.32.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v401.32.0) (2022-04-08)

### Features

* Добавлен clarification в ConfirmPersonalUserRegReadOnlyAddr [EPGUCORE-86023]
* Добавлена валидация в Адреса в компоненте AddressInput [EPGUCORE-90117]
* Добавлена валидация в Адреса в компоненте RegistrationAddr [EPGUCORE-90116]
* Добавлена валидация в ConfirmPersonalUserRegReadOnlyAddr [EPGUCORE-90115]
* Добавлен Clarifications для MultipleChoiceDictionary [EPGUCORE-86336]
* Добавлен slotsErrorHandling для TimeSlot [EPGUCORE-89927]
* Добавлен disclaimer в confirm-personal-policy [EPGUCORE-88610]
* Добавлен errorBookingHandling для TimeSlotDoctors [EPGUCORE-89926]
* Реализован дисклеймер при отсутствии индекса в RegistrationLegalAddr [EPGUCORE-89049]
* Добавлено использование компонента TimeSlot для услуг ПГС [EPGUCORE-67218]

### Refactor

* Убраны избыточные зависимости в скринах [EPGUCORE-89406]
* Смерджена карта кружков, добавлена поддержка фильтров в компонентах кружков [EPGUCORE-84527]

### Bug Fixes

* Поправлена модалка для docLookup [EPGUCORE-88568]
* Включение notify для clipboard в outputhtml [EPGUCORE-85543]
* Исправлена валидация контрольной суммы MaritalStatusInput [EPGUCORE-90123]
* Добавлен параметр IsFinalReservation для TimeSLot [EPGUCORE-90472]
* Поправлено отображение presetValue для FieldsList [EPGUCORE-89897]
* Поправлена работа ссылок в lib-header [EPGUCORE-90452]
* Поддержка целочисленных типов в mappingParams, multi-choice-dictionary-modal [EPGUCORE-91604]
* Исправлено падение карт на битых судах [EPGUCORE-88374]
* Поправлен цвет фона в sf-portal [EPGUCORE-91980]
* Добавлена обработка "плохих" координат в суды на карте [EPGUCORE-91925]
* Исправлено открытие модалок в модалке [EPGUCORE-91790]
* Исправлено скрытие кнопок у не-CUSTOM screen [EPGUCORE-91815]
* Исправлен дефект, что в меню профиля сбиты переводы [EPGUCORE-91101]
* Добавлена корректная работа atLeastOne в MultipleChoiceDictionary [EPGUCORE-89367]

### Chore

* Зафиксирована версия es5-ext без антивоенных призывов
* Произведена дедупликация зависимостей в yarn.lock [EPGUCORE-91325]
* Поправлен алгоритм продуктовой сборки sf-portal [EPGUCORE-92331]

## [400.54.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.54.0) (2022-03-31)

### Chore

* Обновлен @epgu/ui до 3.0.403-5-frontv3 [EPGUCORE-92574]

## [400.51.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.51.0) (2022-03-28)

### Bug Fixes

* Правка логики обработки 410 в getNextStep и waitingOrderCreate [EPGUCORE-91507]
* Добавлен конфижный pollingTimeoutMs для настройки полинга троббера [EPGUCORE-92192]

## [400.48.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.48.0) (2022-03-25)

### Bug Fixes

* Убран закрывающий крестик в модалке мульти-черновиков [EPGUCORE-91617]
* Поправлена логика определения скрытия хедера по isBrandSpecificWebView [EPGUCORE-92022]
* В multi choice dict не делается запрос для статических справочников [EPGUCORE-91881]
* Скорректирована работа ESC для закрытия модалки при backdropDismiss: false [EPGUCORE-91959]

### Chore

* Оптимизация сборки sf-portal [EPGUCORE-91618]

## [400.44.3](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.44.3) (2022-03-22)

### Bug Fixes

* Поправлена работа mappingParams в компоненте MultipleChoiceDictionary [EPGUCORE-91364]
* Поправлена логика определения новых WebView userAgent [EPGUCORE-90903]
* Поправлена опечатка в текстовке openSelectOrderModal [EPGUCORE-91571]
* Изменен вывод именованных черновиков в модалке выбора мульти-черновиков [EPGUCORE-91563]
* Поправлена доступность кнопки Продолжить для DictionaryLikeComponent [EPGUCORE-91568]

## [400.43.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.43.0) (2022-03-21)

### Features

* Добавлена поддержка фильтрации и displayOff для MultipleChoiceDictionary [EPGUCORE-89031]

### Bug Fixes

* Исправлен выбор языка в Dictionary [EPGUCORE-91030]
* Добавлен isLoading на кнопку в screen-buttons.component [EPGUCORE-91323]
* Поправлена передача orderId в ContinueOrderModalService [EPGUCORE-91344]
* Поправлено поведение Lookup, теперь он не дисейблится, если спрочник пустой [EPGUCORE-91394]

## [400.40.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.40.0) (2022-03-17)

### Features

* Добавлена поддержка словарей schoolDictionaryUrl и schoolSearchUrl [EPGUCORE-89110]
* Добавил атрибут emptyDictError для SelectFromList [EPGUCORE-89001]
* Добавлен функционал блокирования экранных кнопок через ref buttons [EPGUCORE-86308]
* Добавлен параметр screenId, пофикшена работа скрытой кнопки в prev-button [EPGUCORE-89472]

### Bug Fixes

* Поправлено отображение ошибки в SelectFromList [EPGUCORE-90870]
* Исправлено отображение оставшихся элементов в list-pagination.service [EPGUCORE-88670]
* Исправлены пропадающие кнопки на screen-buttons [EPGUCORE-90771]
* Исправлен дефект, что при нажатии на кнопку верно ничего не происходит [EPGUCORE-90550]
* Исправлен дефект, что кнопка сабмита в разных местах нажимается только со второго раза [EPGUCORE-90724]
* Исправлено восстановление select-from-list.component из cachedAnswers [EPGUCORE-90760]
* Убраны лишние внутренние отступы в css-классе disabled-white-bg [EPGUCORE-90761]
* Поправлено, что верстка экрана с компонентом SelectFromList не соответсвует фигме [EPGUCORE-90634]

### Chore

* Застолблены версии всех зависимостей [EPGUCORE-91214]

## [400.28.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.28.2) (2022-03-06)

### Bug Fixes

* Поправлен caseNumber для TimeSlot Birth [EPGUCORE-90052]
* Поправлен запроса таймслотов типа birth [EPGUCORE-90052]

## [400.26.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.26.0) (2022-03-04)

### BREAKING CHANGES

* Упразднение костыльного закардкоженного метода checkAndFetchCarModel в КФ. Необходимо поддержать измение на уровне json, где используются обращения к справочникам MARKI_TS, MODEL_TS. Обратная совместимость сохраняется. [EPGUCORE-72612]

### Features

* Добавлено isClearable и defaultLabelList для DictionaryComponent [EPGUCORE-86314]
* Добавлено приложение versions [EPGUCORE-85909]
* Добавлен customUnrecLabel в MultipleChoiceDictionary [EPGUCORE-86325]
* Добавлен customUnrecLabel в компонент textArea [EPGUCORE-85567]
* Поддержка grey цвета для css-класса divider [EPGUCORE-85720]
* Добавлена валидация адреса в ConfirmPersonalUserAddress [EPGUCORE-84772]
* Добавлена возможность скрывать компоненты по дате через ref [EPGUCORE-85769]
* Добавлен новый компонент SelectFromList [EPGUCORE-85018]
* Добавлено скрытие header/footer/робот Макс для МП [EPGUCORE-86689]
* Добавлен isInvite для timeslot [EPGUCORE-85384]
* Добавлен линтер в sf-portal [EPGUCORE-87306]
* Добавлен isInvite в MapService [EPGUCORE-85997]
* Добавлен прелоад шрифтов Lato для sf-portal [EPGUCORE-79244]
* Добавлен прелоадер при открытии окна с ранее загруженными файлами [EPGUCORE-86175]
* Валидация работает так как описано в json [EPGUCORE-83311]
* Добавлена поддержка конфиг-параметра isYaMetricDisabled для sf-portal [EPGUCORE-87546]
* Добавлена функциональность в MultipleChoiceDictionary из LookupInput [EPGUCORE-88058]
* Добавлено мод. окно с выбором черновика, при появлении 404 ошибки в навигации формы [EPGUCORE-86266]
* Добавлены clarifications для text-area [EPGUCORE-86019]
* Добавлена поддержка stringDotFormat для дат из ЛК [EPGUCORE-88160]
* Добавлена фича при открытии услуг дополнительно производить проверку региона [EPGUCORE-86590]
* Добавлена поддержка hint для registration addr на уровне компонента [EPGUCORE-87038]
* Добавлена поддержка clarifications для компонента ConfirmPersonalUserRegAddr [EPGUCORE-86022]
* Добавлена поддержка clarifications для radio-input[EPGUCORE-86018]
* Добавлена поддержка clarifications для ConfirmPersonalUserPhone [EPGUCORE-86020]
* Добавлена поддержка mappingParams для MVDGiac [EPGUCORE-88801]
* Добавлена поддержка clarifications для AddressInput [EPGUCORE-86014]
* Добавлена поддержка встраивания sf-portal в iframe [EPGUCORE-85935]
* Добавлены валидации в MaritalStatusInput [EPGUCORE-86855]
* Добавлена поддержка скрытия header (шапки) для WebView, footer (подвал) упразднен [EPGUCORE-89076]

### Refactor

* Переименованы параметры в методах ComponentsListFormService и DateRangeService [EPGUCORE-85318]
* Добавлен поиск parentFirst и parentLast из дочерних компонент [EPGUCORE-79609]
* Правка лишней проверки в config.component.html [EPGUCORE-84013]
* Оптимизация ConfirmPersonalUserData, добавление в ScreenService screenStore$ [EPGUCORE-84010]
* Изменение стратегии обнаружения с Default на OnPush по проекту [EPGUCORE-84009]
* Оптимизирован рендеринг элементов списка на карте [EPGUCORE-86830]
* Комплесный рефактор, уменьшающий кол-во warnings при сборке [EPGUCORE-80320]
* Переименованы конфигурационные параметры Disabled > Enabled [EPGUCORE-87853]
* Изменен ConfirmPersonalUserDataPipe, кейс: без fields groups [EPGUCORE-78356]
* Переписан isValid() в ValidationService в пользу компонентных getSpecificValidators() [EPGUCORE-88529]
* Переписаны стили в component-list и component-item [EPGUCORE-86502]

### Bug Fixes

* Исправлена работа suggests в SnilsInput [EPGUCORE-86706]
* Поправлена работа скролла контента под модальными окнами [EPGUCORE-84462]
* Чинит скролл в окне выбора подразделений [EPGUCORE-86114]
* Стилевые правки по верстке в компонентах карты [EPGUCORE-85778]
* Блок фокуса при нажатии на tab в DropdownListComponent [EPGUCORE-75278]
* Поправлено присвоение значения атрибута hideHouseCheckbox в AddressInputModelAttrs [EPGUCORE-86568]
* Поправлен smev2 для новой версии timeslot [EPGUCORE-81819]
* Исправлено восстановление snils для children из cachedAnswers [EPGUCORE-86787]
* Изменены стили и набор атрибутов компонента Checkbox [EPGUCORE-75228]
* Правка HealthService для suggest сервиса [EPGUCORE-87298]
* Исправления для selectedItems в MultipleChoiceDictionary [EPGUCORE-86678]
* Восстановлена передача хитов в метрику для новых форм [EPGUCORE-87367]
* Поправлен фокус на списке врачей в таймслотах [EPGUCORE-86457]
* Добавлен класс убирающий лишний отступ листа без заголовка в инфо скрине [EPGUCORE-86834]
* Поправлен детектор изменений в ScreenResolverComponent [EPGUCORE-84009]
* Починен механизм stepsBack и атрибута hidden [EPGUCORE-86334]
* Поправлено условие отмены TimeSlot [EPGUCORE-88096]
* Поправлен формат даты для отправки на бэк согласно контракту в MaritalStatusInputComponent [EPGUCORE-86304]
* Сделано наличие attrs на уровне филдов необязательным в DocInput [EPGUCORE-87973]
* Исправлена включенная кнопка на экране списка садов [EPGUCORE-87452]
* Поправлены параметры у Birth Timeslot [EPGUCORE-88420]
* Добавлено определение типа PARENT_ID для MultiChoice [EPGUCORE-88029]
* Исправлено, что при прикреплении файла из галереи не блокируется кнопка Далее в FileItemUpload [EPGUCORE-88583]
* Поправлена работа троббера при переходах [EPGUCORE-88692]
* Исправление для ComplexChoiceDictionary в выборе чекбоксов [EPGUCORE-88291]
* Исправлен скролл списка на карте при клике на пин [EPGUCORE-88603]
* Изменен способ извлечения bookedSlot в TimeSlot [EPGUCORE-88599]
* Изменен способ получения текущей даты в timer компоненте [EPGUCORE-88594]
* Исправлено заполнение полей кастомного ребенка [EPGUCORE-88573]
* Поправлена функция глобального скрытия иконок соц.сетей [EPGUCORE-89151]
* Показывать лоадер если задан троббер [EPGUCORE-88692]
* Налажена работа TranslateModule в sf-portal [EPGUCORE-88171]
* Добавлена jsonHelperService в validation.service.ts [EPGUCORE-89296]
* Поправлен парсинг саджестов для автокомлита в EmployeeHistory [EPGUCORE-89341]
* Поправлены пути до шрифтов в sf-portal/index.html [EPGUCORE-79244]
* Поправлено отображение данных свид. о рождении в FieldListComponent [EPGUCORE-89351]
* Исправлено отображение плейсхолдеров в ConfirmLegalData [EPGUCORE-89351]
* Исправление multiple-choice-dictionary.component [EPGUCORE-89447]
* Сохраняем выбранные до этого элементы иерархического словаря [EPGUCORE-89521]
* Поправлен 25 статус TimeSlot [EPGUCORE-89605]
* Добавлена поддержка CalendarInput в AutocompletePrepareService для suggests2 [EPGUCORE-89520]
* Исправлены пропадающие филды в ConfirmPersonalUserData [EPGUCORE-89332]
* Поправлены иконки закрытия RepeatableFields на уровне заголовка [EPGUCORE-89653]
* Исправлена ошибка no provider на карте [EPGUCORE-89759]
* Увеличен z-index для иконок закрытия RepeatableFields [EPGUCORE-89653]

### Tests

* Добавлены тесты для PriorityScreenComponent [EPGUCORE-85301]
* Добавлены тесты ContinueOrderModalService [EPGUCORE-85299]
* Поправлены тесты MonthPicker [EPGUCORE-76608]
* Ускорен тест: заменена картинка, оптимизированы вызовы тяжелого метода в CompressionService [EPGUCORE-87310]
* Подключены и поправлены тесты в sf-portal, изменён параметр nohoist - [EPGUCORE-87321]
* Добавлены тесты для HealthService [EPGUCORE-85309]
* Поправлены тесты для FileUpload [EPGUCORE-85317]
* Добавлены тесты на compression service [EPGUCORE-85281]
* Добавлены тесты для UploaderManagerService [EPGUCORE-88301]
* Добавлены тесты для GenderRadioButtonComponent [EPGUCORE-88563]
* Добавлены тесты для TimeSlotResolverVersionComponent [EPGUCORE-88903]

### Chore

* Поправлен конфиг jest для Angular Ivy [EPGUCORE-85541]
* Обновление либы jest-angular-preset, фиксящий кривую работу с ts-кэшом [EPGUCORE-85541]
* Обновлены зависимости @epgu

## [399.18.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v399.18.0) (2022-02-14)

### BREAKING CHANGES
* Мини-приложение СhildrenСlubs декомпозировано на 3 самостоятельных UNIQUE-компонента ProgramList, ProgramView, GroupList в контуре КФ. Необходимые изменения на бэке EPGUCORE-81501 и в json - EPGUCORE-84364. Обратная совместимость с мини-приложением СhildrenСlubs сохраняется на время жизни старых черновиков (3 месяца) [EPGUCORE-81501]

### Features

* Добавлена поддержка clarifications для CheckboxInput [EPGUCORE-85097]
* Добавлена поддержка subLabel, isTextHelper, largeFontSize для RadioInput [EPGUCORE-83778]
* Добавлен лимит для форматирования больших чисел - до 16 символов при rank = true [EPGUCORE-84233]
* Добавлено форматирование чисел в FieldList при rank = true [EPGUCORE-85266]
* Добавлена поддержка customUnrecLabel для AddressInput [EPGUCORE-77642]
* Добавлена поддержка типов cropper в PhotoUploadComponent [EPGUCORE-82316]
* Добавлен вывод user-friendly ошибки при Internal Error в вызове справочника mzrf_regions_smev3 [EPGUCORE-82540]
* Добавлена поддержка кастомного текста в модальном окне просмотра фото компонента FileUploadComponent [EPGUCORE-82628]
* Добавлено отображение hint у DataInput, TextArea [EPGUCORE-84134]
* Добавлена поддержка BarbarbokMapServiceComponent [EPGUCORE-84361]
* Добавлена поддержка новых иконок в PhotoUploadComponent [EPGUCORE-84494]
* Добавлен управляющий флаг error.hideTraceId для скрытия/показа traceId в errorModalWindow [EPGUCORE-84975]
* Добавлены новые иконки [EPGUCORE-85096]
* Добавлены clarifications для DateInput [EPGUCORE-86015]
* Добавлены clarifications для MvdGias [EPGUCORE-86017]
* Добавлена поддержка ConfirmCode в errorModalWindow [EPGUCORE-85581]
* Добавлена блокировка кнопки "Продолжить" пока идет загрузка файлов [EPGUCORE-85133]
* Добавлена поддержка isServiceSpecific для TimeSlot компонентов [EPGUCORE-86300]
* Добавлен компонент not-found в sf-portal [EPGUCORE-85703]
* Поддержка Trobber для logicAfterValidationComponents [EPGUCORE-85052]
* Добавлен новый компонент MedicalBirthCertificates [EPGUCORE-85940]
* Доработка компонента ComplexChoiceDictionary в части выбора только одного чек-бокса [EPGUCORE-85236]

### Refactor

* Миграция c Angular 12.2.5 на Angular 13.1.1 [EPGUCORE-81636]
* Добавлен явный ререндер списка для TimeSlotDoctorsComponent [EPGUCORE-84639]
* Оптимизация: убран избыточный error-handler в children-clubs в КФ [EPGUCORE-84532]
* Оптимизация: созданы компонентные обработчики ошибок на основе общего обработчика в errorHandlerService [EPGUCORE-81336]
* Оптимизация: переиспользована pallete.scss из epgu-lib и удалена дублирующая палитра в ui-kit [EPGUCORE-83727]
* Оптимизация: переиспользована offsets.scss из epgu-lib и удалены дублирования в ui-kit [EPGUCORE-83729]
* Оптимизация: добавлены trackBy в крупных итерациях *ngFor, где нужно [EPGUCORE-84012]
* Оптимизация: добавлена стратегия FOUT вместо FOIT для шрифтов [EPGUCORE-84016]
* Оптимизация: рефактор DictionaryService из children-clubs в КФ [EPGUCORE-84528]
* Оптимизация: рефактор ApiService из children-clubs в КФ [EPGUCORE-84530]
* Оптимизация: упразднен ContentModal в пользу ConfirmationModal из children-clubs в КФ [EPGUCORE-84534]
* Улучшение сборки: изменен принцип генерации кэша для gitlab-ci [EPGUCORE-85542]
* Оптимизация: рефактор сервисов GroupListService и ProgramListService [EPGUCORE-85313]

### Bug Fixes

* Возвращена проверка корректности данных в DocInput, полученных из ЕСИА [EPGUCORE-63464]
* Поправлена логика finalScreen для корректного отображения кнопок [EPGUCORE-82971]
* Исправлены стили кнопок на мобилке [EPGUCORE-83515]
* Поправлены отступы для add-passport [EPGUCORE-63624]
* Поправлены отступы для файловых загрузчиков [EPGUCORE-84843]
* Поправлены отступы между контролами формы на CUSTOM-screen  [EPGUCORE-78769]
* Поправлено отображение кнопок до окончания поиска сертификата в EaisdoGroupCostService [EPGUCORE-80762]
* Поправлен межстрочный интервал в RadioInput [EPGUCORE-81076]
* Добавлен сброс невалидной даты в DateInput, ConfirmPersonalUserAddressComponent, ConstructorDatePickerComponent [EPGUCORE-81851]
* Убрано превью для файлов с разрешением sig в UploaderManagerItemComponent [EPGUCORE-81876]
* Убрана валидация необязательных полей в CalendarInputComponent [EPGUCORE-81909]
* Поправлена работа параметра showPlaceholderOnFocus у StringInput [EPGUCORE-82329]
* Поправлена верстка в окне "Ранее заполненные данные" при попытке просмотреть подсказки [EPGUCORE-82619]
* Поправлена работа подсказок в полях "Серия" и "Номер" в PassportLookup (s112) [EPGUCORE-82734]
* Поправлена верстка моб. версии info-screen--deadlock [EPGUCORE-82820]
* Актуализированы иконки, используемые на экранах "Загрузите документы"/"Заявление создано" [EPGUCORE-83584]
* Поправлен текст ошибки в обработке INTERNAL_ERROR [EPGUCORE-82540]
* Поправлен символ рубля в PaymentComponent [EPGUCORE-83335]
* Поправлены стили для списков, если они находятся внутри background-white [EPGUCORE-83336]
* Поправлены шрифты woff2 для корректной работы в Safaria [EPGUCORE-85708]
* Поправлена работа шторки карты для айфона [EPGUCORE-85433]
* Поправлена генерация mnemonic у файлов из suggests в FileUploadItemComponent [EPGUCORE-85706]
* Поправлено отображание ошибок валидации при автокомплите [EPGUCORE-80775]
* Откат фичи с raw-loader иконок для починки продуктовой сборки [EPGUCORE-86260]
* Исправлен дизайн для ошибок в ConfirmPersonalUserEmail [EPGUCORE-85793]
* Удален FilePonyfill (поддержка IE11) для починки FileUploadItemComponent [EPGUCORE-86444]
* Поправлено отображение балуна на картах [EPGUCORE-85732]
* Поправлен дефект, связанный с добавлением isServiceSpecific в TimeSlot [EPGUCORE-86543]
* Поправлен дизайн разделителей на загрузке файлов [EPGUCORE-85749]
* Поправлен цвет фона для NotFoundComponent [EPGUCORE-85703]
* Поправлен путь до артибута hideTraceId в errorModalWindow [EPGUCORE-84975]
* Исправлено "Не прикладывается второй файл из саджестов" [EPGUCORE-86946]
* Правки по internal-error [EPGUCORE-82540]
* Исправлено ref displayOn не срабатывает. Кнопка далее неактивна при возврате назад [EPGUCORE-86211]
* Исправлена работа trobber, если не задан timeout в RestCallComponent [EPGUCORE-87527]
* Исправлен текст в модальном окне при ошибке 409 [EPGUCORE-82665]
* Поправлен вывод информации о booking timeslot [EPGUCORE-67487]
* Исправлена работа rest call [EPGUCORE-88035]

### Tests

* Поправлены скипнутые тесты [EPGUCORE-83083]
* Написание тестов на компонент YandexMapService [EPGUCORE-76605]
* Написание тестов на компонент DateInputComponent [EPGUCORE-76607]
* Написание тестов на компонент MonthPickerComponent [EPGUCORE-76608]
* Написание тестов на компонент TimeSlotDoctorService [EPGUCORE-76617]
* Написание тестов на компонент FileUploadPreviewComponent [EPGUCORE-76618]
* Написание тестов на компонент UploaderProcessService [EPGUCORE-76620]
* Написание тестов на компонент UploaderStatService [EPGUCORE-76621]
* Написание тестов на компонент ZoomComponent [EPGUCORE-76622]
* Написание тестов на компонент DateRangeService [EPGUCORE-76623]
* Починка сломанных тестов в DictionaryService [EPGUCORE-85293]
* Добавлены тесты для InterceptorUtilsService [EPGUCORE-85300]
* Добавлены тесты PaymentSelectorComponent [EPGUCORE-85302]
* Добавлены тесты на LogicResolver [EPGUCORE-85307]

## [0.x.x](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v0.x.x) (2022-01-01)

### BREAKING CHANGES

*

### Features

*

### Refactor

*

### Bug Fixes

*

### Tests

*

### Chore

*