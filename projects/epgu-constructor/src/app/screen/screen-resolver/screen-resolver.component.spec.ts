import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScreenResolverComponent } from './screen-resolver.component';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenTypes } from '../screen.types';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  template: '<div>test</div>',
})
class TestComponent {}

Object.defineProperty(SCREEN_COMPONENTS, 'TEST', {
  value: TestComponent,
});

describe('ScreenResolverComponent', () => {
  let component: ScreenResolverComponent;
  let fixture: ComponentFixture<ScreenResolverComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenResolverComponent, TestComponent],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TestComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenResolverComponent);
    component = fixture.componentInstance;

    // Нужно установить screenService.screenType до инициализации компонента,
    // иначе компонент выбросит исключение в ngOnInit
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    // @ts-ignore
    screenService.screenType = 'TEST';

    fixture.detectChanges();
  });

  it('should render screenComponent', () => {
    component.screenComponent = (TestComponent as unknown) as ScreenComponent;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(TestComponent))).toBeTruthy();
  });

  it('should set screen component on screen type change', () => {
    const setScreenComponentSpy = spyOn(component, 'setScreenComponent');

    screenService.screenType = ScreenTypes.COMPONENT;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(ScreenTypes.COMPONENT);
    setScreenComponentSpy.calls.reset();

    screenService.screenType = ScreenTypes.CUSTOM;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(ScreenTypes.CUSTOM);
  });

  describe('setScreenComponent() method', () => {
    it('should update screenComponent property', () => {
      component.setScreenComponent(ScreenTypes.EMPTY);
      expect(component.screenComponent).toBe(SCREEN_COMPONENTS[ScreenTypes.EMPTY]);

      component.setScreenComponent(ScreenTypes.INFO);
      expect(component.screenComponent).toBe(SCREEN_COMPONENTS[ScreenTypes.INFO]);
    });

    it('should throw ScreenComponentError if is called with unrecognized screen type', () => {
      expect(() => {
        component.setScreenComponent(ScreenTypes.INVITATION_ERROR);
      }).not.toThrow();

      expect(() => {
        component.setScreenComponent('unrecognized screen type' as ScreenTypes);
      }).toThrow();
    });
  });

  describe('getScreenComponentByType() method', () => {
    it('should return component from SCREEN_COMPONENTS', () => {
      expect(component.getScreenComponentByType(ScreenTypes.INFO)).toBe(
        SCREEN_COMPONENTS[ScreenTypes.INFO],
      );
      expect(component.getScreenComponentByType(ScreenTypes.EMPTY)).toBe(
        SCREEN_COMPONENTS[ScreenTypes.EMPTY],
      );
      expect(component.getScreenComponentByType(ScreenTypes.UNIQUE)).toBe(
        SCREEN_COMPONENTS[ScreenTypes.UNIQUE],
      );
    });
  });
});
