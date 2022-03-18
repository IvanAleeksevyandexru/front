# Release Notes

## [401.x.x](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v401.x.x) (2022-03-15)

### Features

* Добавлен clarification в ConfirmPersonalUserRegReadOnlyAddr [EPGUCORE-86023]
* Добавлена поддержка словарей schoolDictionaryUrl и schoolSearchUrl [EPGUCORE-89110]
* Добавлен параметр screenId, пофикшена работа скрытой кнопки в prev-button [EPGUCORE-89472]
* Добавлена валидация в Адреса в компоненте AddressInput [EPGUCORE-90117]
* Добавлена валидация в Адреса в компоненте RegistrationAddr [EPGUCORE-90116]
* Добавлена возможность скрывать и дизейблить кнопки по relations [EPGUCORE-86308]

### Refactor

* Убраны избыточные зависимости в скринах [EPGUCORE-89406]
* Смерджена карта кружков, добавлена поддержка фильтров в компонентах кружков [EPGUCORE-84527]

### Bug Fixes

* Заменен текст в модалке для кейса "врачи не найдены" [EPGUCORE-88568]
* Включение notify для clipboard в outputhtml [EPGUCORE-85543]
* Исправлено отображение оставшихся элементов в list-pagination.service [EPGUCORE-88670]
* Исправлена валидация контрольной суммы MaritalStatusInput [EPGUCORE-90123]
* Добавлен параметр IsFinalReservation для TimeSLot [EPGUCORE-90472]
* Поправлено отображение presetValue для FieldsList [EPGUCORE-89897]
* Поправлено обновление данных у ref-buttons [EPGUCORE-90550]
* Добавлен атрибут emptyDictError для SelectFromList [EPGUCORE-89001]
* Исправлено восстановление select-from-list.component из cachedAnswers [EPGUCORE-90760]
* Поправлена работа ссылок в lib-header [EPGUCORE-90452]
* Исправлены пропадающие кнопки на screen-buttons [EPGUCORE-90771]
### Chore

* Зафиксирована версия es5-ext без антивоенных призывов

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

* Доработка компонента ComplexChoiceDictionary в части выбора только одного чек-бокса [EPGUCORE-85236]
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
* Доработка компонента ComplexChoiceDictionary [EPGUCORE-85236]
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
* Доработки по авторизации встраивания в iframe [EPGUCORE-85935]
* Добавлена поддержка скрытия header (шапки) для WebView, footer (подвал) упразднен [EPGUCORE-89076]

### Refactor

* Переименованы параметры в методах ComponentsListFormService и DateRangeService [EPGUCORE-85318]
* Добавлен поиск parentFirst и parentLast из дочерних компонент [EPGUCORE-79609]
* Правка лишней проверки в config.component.html [EPGUCORE-84013]
* Оптимизация ConfirmPersonalUserData, добавление в ScreenService screenStore$ [EPGUCORE-84010]
* Добавлена возможность скрывать/открывать панели стендов в versions. Добавлен config.json для API. Рефакторинг кода и стилей. [EPGUCORE-85909]
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
* Поправлен вывод информации о booking timeslot [EPGUCORE-67487]
* Исправлено восстановление snils для children из cachedAnswers [EPGUCORE-86787]
* Изменены стили и набор атрибутов компонента Checkbox [EPGUCORE-75228]
* Правка HealthService для suggest сервиса [EPGUCORE-87298]
* Исправления для selectedItems в MultipleChoiceDictionary [EPGUCORE-86678]
* Восстановлена передача хитов в метрику для новых форм [EPGUCORE-87367]
* Поправлен фокус на списке врачей в таймслотах [EPGUCORE-86457]
* Добавлен класс убирающий лишний отступ листа без заголовка в инфо скрине [EPGUCORE-86834]
* Поправлен детектор изменений в ScreenResolverComponent [EPGUCORE-84009]
* Починен механизм stepsBack и атрибута hidden [EPGUCORE-86334]
* Поправлен вывод информации о booking timeslot [EPGUCORE-67487]
* Правка singleNotifier для отображения нескольких дисклеймеров [EPGUCORE-87879]
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
* Доработки встраивания КФ в iframe / дополнительный параметр проверки [EPGUCORE-85935]
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
* Доработки по встраиванию КФ в iframe [EPGUCORE-85935]

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
* Правка singleNotifier для отображения нескольких дисклеймеров [EPGUCORE-87879]
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

## [0.0.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v0.0.0) (2022-01-01)

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