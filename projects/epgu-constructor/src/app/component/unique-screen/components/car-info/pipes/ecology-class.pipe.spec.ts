import { EcologyClassPipe } from './ecology-class.pipe';

describe('EcologyClassPipe', () => {
  const pipe = new EcologyClassPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return string', () => {
    expect(pipe.transform(1)).toEqual('Первый');
    expect(pipe.transform(2)).toEqual('Второй');
    expect(pipe.transform(3)).toEqual('Третий');
    expect(pipe.transform(4)).toEqual('Четвертый');
    expect(pipe.transform(5)).toEqual('Пятый');
    expect(pipe.transform(10)).toEqual(null);
  });

});
