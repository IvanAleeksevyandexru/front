import { LabelPipe } from './label.pipe';

describe('LabelPipe', () => {
  const labelTest = {
    one: 'Дата оплаты',
    default: 'Число, когда должна списываться оплата по договору',
  } as any;
  const pipe = new LabelPipe();

  it('should be return label', () => {
    const label = pipe.transform(labelTest, 'one');
    expect(label).toBe('Дата оплаты');
  });

  it('should be return default label', () => {
    const label = pipe.transform(labelTest, '' as any);
    expect(label).toBe('Число, когда должна списываться оплата по договору');
  });
});
