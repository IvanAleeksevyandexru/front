import { CarInfoOwnerPipe } from './car-owner-type.pipe';

describe('CarInfoOwnerPipe', () => {
  const pipe = new CarInfoOwnerPipe();

  it('transforms "INDIVIDUAL" to "Физическое лицо"', () => {
    expect(pipe.transform('INDIVIDUAL')).toBe('Физическое лицо');
  });

  it('transforms "LEGAL_ENTITY" to "Юридическое лицо"', () => {
    expect(pipe.transform('LEGAL_ENTITY')).toBe('Юридическое лицо');
  });
});
