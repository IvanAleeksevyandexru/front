import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScreenResolverComponent } from './screen-resolver.component';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { SCREEN_COMPONENTS } from '../screen.const';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { configureTestSuite } from 'ng-bullet';
import { ScreenTypes } from '@epgu/epgu-constructor-types';

@Component({
  template: '<div>test</div>',
})
class TestComponent {}

@Component({
  template: '<div>test</div>',
})
class Test2Component {}

Object.defineProperties(SCREEN_COMPONENTS, {
  TEST: {
    value: TestComponent,
  },
  TEST2: {
    value: Test2Component,
  }
});

jest.useFakeTimers();

describe('ScreenResolverComponent', () => {
  let component: ScreenResolverComponent;
  let fixture: ComponentFixture<ScreenResolverComponent>;
  let screenService: ScreenServiceStub;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [ScreenResolverComponent, TestComponent, Test2Component],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TestComponent, Test2Component],
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
    jest.runAllTimers();
    expect(fixture.debugElement.query(By.directive(TestComponent))).toBeTruthy();
  });

  it('should set screen component on screen type change', () => {
    jest.runAllTimers();
    expect(component.componentRef.instance).toBeInstanceOf(TestComponent);

    // @ts-ignore
    screenService.screenType = 'TEST2';
    fixture.detectChanges();
    jest.runAllTimers();

    expect(component.componentRef.instance).toBeInstanceOf(Test2Component);
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
