import { Smev3ErrorMessagePipe } from './smev-3-error-message.pipe';

describe('SafeUrlPipe', () => {
  let pipe: Smev3ErrorMessagePipe;

  beforeEach( () => {
    pipe = new Smev3ErrorMessagePipe();
  });

  it('should remove first substring before : sign', () => {
    const expectedMessage = 'Направление пациента с указанным номером не найдено. Пожалуйста, проверьте корректность введенных выше данных.';
    const actualMessage = pipe.transform(`NO_DATA:${expectedMessage}`);

    expect(actualMessage).toBe(expectedMessage);
  });

  it('should no transform string without :', () => {
    const expectedMessage = 'Направление пациента с указанным номером не найдено. Пожалуйста, проверьте корректность введенных выше данных.';
    const actualMessage = pipe.transform(expectedMessage);

    expect(actualMessage).toBe(expectedMessage);
  });
});
