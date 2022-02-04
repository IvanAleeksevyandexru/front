# Release Notes

## [400.0.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v400.0.0) (2022-02-04)

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

### Refactor

* Переименованы параметры в методах ComponentsListFormService и DateRangeService [EPGUCORE-85318]
* Добавлен поиск parentFirst и parentLast из дочерних компонент [EPGUCORE-79609]
* Правка лишней проверки в config.component.html [EPGUCORE-84013]
* Оптимизация ConfirmPersonalUserData, добавление в ScreenService screenStore$ [EPGUCORE-84010]
* Добавлена возможность скрывать/открывать панели стендов в versions. Добавлен config.json для API. Рефакторинг кода и стилей. [EPGUCORE-85909]

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

### Tests

* Добавлены тесты для PriorityScreenComponent [EPGUCORE-85301]
* Добавлены тесты ContinueOrderModalService [EPGUCORE-85299]
* Поправлены тесты MonthPicker [EPGUCORE-76608]
* Ускорен тест: заменена картинка, оптимизированы вызовы тяжелого метода в CompressionService [EPGUCORE-87310]

## [399.8.2](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v399.8.2) (2022-02-04)

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
* Исправлено ложное срабатывание notify при clipboard для ios [EPGUCORE-85543]
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