import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MapAnimationService } from './map-animation.service';

describe('MapAnimationService', () => {
  let service: MapAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MapAnimationService],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(MapAnimationService);
  });

  describe('get firstLoading()', () => {
    it('should return true on first call and false on next calls', () => {
      const res = service.firstLoading;
      const res1 = service.firstLoading;

      expect(res).toBeTruthy();
      expect(res1).toBeFalsy();
    });
  });

  describe('setInitData()', () => {
    it('should set object ids to inner property', () => {
      service.setInitData([{ id: 1 } as any]);

      expect(service.animatedIds).toEqual([1]);
    });

    it('should correctly calculate animation step', () => {
      service.setInitData([{ id: 1 } as any]);

      expect(service.animationStep).toEqual(1000);
    });
  });

  describe('handleElementAppearAnimation()', () => {
    jest.useFakeTimers();

    it('should do nothing if ids array does not include passed id', () => {
      jest.spyOn(global, 'setTimeout');
      service.setInitData([{ id: 1 } as any]);
      const element = ({} as unknown) as HTMLElement;
      service.handleElementAppearAnimation(element, 2);

      expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    it('should remove ids from inner property on pass', () => {
      jest.spyOn(global, 'setTimeout');
      service.setInitData([{ id: 1 }, { id: 2 }] as any);
      const element = ({ classList: { add: () => null }, style: {} } as unknown) as HTMLElement;

      service.handleElementAppearAnimation(element, 2);
      service.handleElementAppearAnimation(element, 2);

      expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it('should call set timeout with increasing interval', () => {
      jest.spyOn(global, 'setTimeout');
      service.setInitData([{ id: 1 }, { id: 2 }] as any);
      const element = ({ classList: { add: () => null }, style: {} } as unknown) as HTMLElement;

      service.handleElementAppearAnimation(element, 2);
      service.handleElementAppearAnimation(element, 1);

      expect(setTimeout).toHaveBeenCalledTimes(3);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });
  });
});
