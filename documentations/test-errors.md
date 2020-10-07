Ошибка: Importing EpguLibModule which does not have a ɵmod property;
Решение: если используется заменяю импорт SharedModule, то можно заменить его на импорт отдельных компонентов
Решение:


Ошибка: No value accessor for form control with name: 'ef300e3a-c364-4339-bb32-3f9f466e907b'
Решение: удалил fixture.detectChanges();
Вопрос: для чего нужно вызывать fixture.detectChanges()


Ошибка: The pipe 'safeHtml' could not be found!
Решение: Заменить нашим кастомным пайпом 'safe' с соответствующим типом.

Ошибка: If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as 'standalone' in ngModelOptions.
Решение: каждый элемент использующий ngModel должен иметь 'name'


Действие: для description заменяем на description.skip или xdescription, пробы пропустить тест.
Ошибка: Test suite failed to run. Your test suite must contain at least one test.
Решение: нужно добавить хотя бы один тест. Например
  it('nothing', () => {
    expect(true).toBeTruthy();
  });
