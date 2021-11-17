import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentListResolverComponent } from './component-list-resolver.component';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { CUSTOM_SCREEN_COMPONENTS } from './component-list-resolver.const';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { CustomScreenComponentTypes } from '../components-list.types';
import { ScreenTypes } from '@epgu/epgu-constructor-types';

@Component({ template: '<div>test</div>' })
class TestComponent {}

@Component({ template: '<div>test</div>' })
class Test2Component {}

Object.defineProperties(CUSTOM_SCREEN_COMPONENTS, {
  TEST: {
    value: TestComponent,
  },
  TEST2: {
    value: Test2Component,
  },
});

jest.useFakeTimers();

describe('ComponentListResolverComponent', () => {
  let component: ComponentListResolverComponent;
  let fixture: ComponentFixture<ComponentListResolverComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentListResolverComponent, TestComponent, Test2Component],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }, UnsubscribeService],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TestComponent, Test2Component],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentListResolverComponent);
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
    expect(component.getComponentByType(CustomScreenComponentTypes.AddressInput)).toBe(
      CUSTOM_SCREEN_COMPONENTS[CustomScreenComponentTypes.AddressInput],
    );
    expect(component.getComponentByType(CustomScreenComponentTypes.CheckingAccount)).toBe(
      CUSTOM_SCREEN_COMPONENTS[CustomScreenComponentTypes.CheckingAccount],
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
