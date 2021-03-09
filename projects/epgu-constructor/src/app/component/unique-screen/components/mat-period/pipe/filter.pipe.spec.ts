import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPipe();
    expect(pipe).toBeTruthy();
  });

  describe('filtered array', () => {
    const pipe = new FilterPipe();
    const list = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    it('should be return filtered array from 1 position', () => {
      const expectedArray = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const array = pipe.transform(list as any, 1);
      expect(array).toEqual(expectedArray);
    });

    it('should be return filtered array from 0 position to 1 position', () => {
      const expectedArray = [{ id: 0 }, { id: 1 }];
      const array = pipe.transform(list as any, 0, 2);
      expect(array).toEqual(expectedArray);
    });
  });
});
