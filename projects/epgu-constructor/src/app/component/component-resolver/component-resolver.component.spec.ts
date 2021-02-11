import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentResolverComponent } from './component-resolver.component';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { ScreenService } from '../../screen/screen.service';
import { UNIQUE_SCREEN_COMPONENTS } from './component-resolver.const';
import { UniqueScreenComponentTypes } from '../unique-screen/unique-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { By } from '@angular/platform-browser';
import { ScreenTypes } from '../../screen/screen.types';

@Component({ template: '<div>test</div>' })
class TestComponent {}

@Component({ template: '<div>test</div>' })
class Test2Component {}

Object.defineProperties(UNIQUE_SCREEN_COMPONENTS, {
  TEST: {
    value: TestComponent,
  },
  TEST2: {
    value: Test2Component,
  }
});

jest.useFakeTimers();

describe('ComponentResolverComponent', () => {
  let component: ComponentResolverComponent;
  let fixture: ComponentFixture<ComponentResolverComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentResolverComponent, TestComponent, Test2Component],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TestComponent, Test2Component],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentResolverComponent);
    component = fixture.componentInstance;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    // @ts-ignore
    screenService.display = { components: [{ type: 'TEST' }], type: ScreenTypes.UNIQUE };
    fixture.detectChanges();
  });

  it('should render any components', () => {
    jest.runAllTimers();
    expect(component.componentRef.instance).toBeInstanceOf(TestComponent);
    expect(fixture.debugElement.query(By.directive(TestComponent))).toBeTruthy();
  });

  it('should render component if component change', () => {
    jest.runAllTimers();
    expect(component.componentRef.instance).toBeInstanceOf(TestComponent);
    // @ts-ignore
    screenService.display = { components: [{ type: 'TEST2' }], type: ScreenTypes.UNIQUE };
    fixture.detectChanges();
    jest.runAllTimers();


    expect(component.componentRef.instance).toBeInstanceOf(Test2Component);
  });


  it('should return screens from UNIQUE_SCREEN_COMPONENTS', () => {
    expect(component.getComponentByType(UniqueScreenComponentTypes.childrenList, ScreenTypes.UNIQUE)).toBe(
      UNIQUE_SCREEN_COMPONENTS[UniqueScreenComponentTypes.childrenList],
    );
    expect(component.getComponentByType(UniqueScreenComponentTypes.billInfo, ScreenTypes.UNIQUE)).toBe(
      UNIQUE_SCREEN_COMPONENTS[UniqueScreenComponentTypes.billInfo],
    );
  });


  it('createComponent() method', () => {
    const unrecognizedType = 'unrecognized type' as any;

    expect(() => {
      component.createComponent('TEST' as any, ScreenTypes.UNIQUE);
    }).not.toThrow();

    expect(() => {
      component.createComponent(unrecognizedType, null);
    }).toThrow();
  });
});
