import { EnginePowerPipe } from './engine-power.pipe';

describe('EnginePowerPipe', () => {
  const pipe = new EnginePowerPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform powers into the displayed value: "power vt/power horse"', () => {
    expect(pipe.transform('100', '120')).toBe('100/120');
  });

  it('shouldn\'t return a displayed value if one of them is missing', () => {
    expect(pipe.transform('100', null)).toBe(null);
  });
});
