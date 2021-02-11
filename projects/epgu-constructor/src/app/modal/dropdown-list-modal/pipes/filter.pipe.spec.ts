import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const pipe = new FilterPipe();

  it('create an instance',() => {
    expect(pipe).toBeTruthy();
  });

  it('should transform by label', () => {
    const items = [{ label: 'мужчина', tags: [] }, { label: 'женщина', tags: [] }] as any;
    expect(pipe.transform(items, 'на')).toEqual(items);
    expect(pipe.transform(items, 'муж')).toEqual([{ label: 'мужчина',  tags: [] }]);
  });

  it('should transform by tags', () => {
    const items = [{ label: 'ааа', tags: ['учитель', 'педагог'] }, { label: 'бб', tags: ['учитель', 'педагог'] }] as any;
    expect(pipe.transform(items, 'учитель')).toEqual(items);
  });

  it('should return empty array', () => {
    const items = [{ label: 'ааа', tags: ['учитель', 'педагог'] }, { label: 'бб', tags: ['учитель', 'педагог'] }] as any;
    expect(pipe.transform(items, 'учить')).toEqual([]);
  });
});
