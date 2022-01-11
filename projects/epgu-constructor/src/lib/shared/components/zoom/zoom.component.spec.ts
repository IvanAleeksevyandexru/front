import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForTestsOnlyModule } from '../../../core/for-tests-only.module';
import { ScreenService } from '../../../screen/screen.service';
import { ZoomComponent } from './zoom.component';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import { SafePipe } from '@epgu/epgu-constructor-ui-kit';

const mockComponent: ComponentDto = {
  attrs: {},
  label: 'testComponent',
  type: '',
  id: '12',
  value: '',
};

describe('ZoomComponent', () => {
  let component: ZoomComponent;
  let fixture: ComponentFixture<ZoomComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomComponent, SafePipe],
      imports: [ForTestsOnlyModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomComponent);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    component = fixture.componentInstance;
    fixture.detectChanges();
    (component.el.nativeElement as any) = {
      style: {},
      clientWidth: 167,
      clientHeight: 167,
      naturalWidth: 1714,
      parentNode: {
        clientHeight: 167,
        clientWidth: 747,
      },
    };
  });

  it('updateZoomLimits should change maxZoom', () => {
    component.updateZoomLimits();
    expect(component.maxZoom).toEqual(10.263473053892216);
  });

  it('changeZoom should change zoom', () => {
    component.minZoom = 3;
    component.maxZoom = 7;
    component.changeZoom(1);
    expect(component.zoom$$.getValue()).toEqual(3);
    component.changeZoom(5);
    expect(component.zoom$$.getValue()).toEqual(5);
    component.changeZoom(10);
    expect(component.zoom$$.getValue()).toEqual(10);
  });

  it('zoomCompute should call changeZoom', () => {
    const spy = jest.spyOn(component, 'changeZoom');
    component.zoomCompute(2);
    expect(spy).toBeCalledWith(0.8);
    component.zoomCompute(-2);
    expect(spy).toBeCalledWith(1.2);
  });

  it('getAvailableSize should work', () => {
    const expectedResult = {
      h: 0,
      w: -290,
    };
    const result = component.getAvailableSize(component.el.nativeElement);
    expect(expectedResult).toStrictEqual(result);
  });

  it('pinchZoom should work', () => {
    const ev = {
      type: 'pinch',
      target: component.el.nativeElement,
      scale: 0.9,
    };
    component.isTouch = true;
    component.pinchZoom(ev);
    expect(component.zoom$$.getValue()).toEqual(0.999);
  });
});
