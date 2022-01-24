# Release Notes

## [399.0.0](http://git.gosuslugi.local/luxoft/epgu2-form-frontend/-/tags/v399.0.0) (2022-01-20)

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