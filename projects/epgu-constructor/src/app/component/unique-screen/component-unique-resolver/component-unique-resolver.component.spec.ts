import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ComponentUniqueResolverComponent } from './component-unique-resolver.component';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { UNIQUE_SCREEN_COMPONENTS } from './component-unique-resolver.const';
import { UniqueScreenComponentTypes } from '../unique-screen-components.types';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { By } from '@angular/platform-browser';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { configureTestSuite } from 'ng-bullet';

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

describe('ComponentUniqueResolverComponent', () => {
  let component: ComponentUniqueResolverComponent;
  let fixture: ComponentFixture<ComponentUniqueResolverComponent>;
  let screenService: ScreenServiceStub;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [ComponentUniqueResolverComponent, TestComponent, Test2Component],
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
    fixture = TestBed.createComponent(ComponentUniqueResolverComponent);
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
    expect(component.getComponentByType(UniqueScreenComponentTypes.childrenList)).toBe(
      UNIQUE_SCREEN_COMPONENTS[UniqueScreenComponentTypes.childrenList],
    );
    expect(component.getComponentByType(UniqueScreenComponentTypes.billInfo)).toBe(
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
