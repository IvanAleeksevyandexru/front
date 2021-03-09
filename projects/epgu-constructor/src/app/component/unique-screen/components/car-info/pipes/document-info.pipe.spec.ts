import { DocumentInfoPipe } from './document-info.pipe';

describe('DocumentInfoPipe', () => {
  const pipe = new DocumentInfoPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return passport info', () => {
    const document = {
      seriesAndNumber: '4565 545454',
      issueDate: '01.01.2000'
    } as any;
    expect(pipe.transform(document)).toBe('4565 545454, дата выдачи 01.01.2000');
  });


  it('should return null if any value is missing', () => {
    const document = {
      issueDate: '01.01.2000'
    } as any;
    expect(pipe.transform(document)).toBe(null);
  });

});
