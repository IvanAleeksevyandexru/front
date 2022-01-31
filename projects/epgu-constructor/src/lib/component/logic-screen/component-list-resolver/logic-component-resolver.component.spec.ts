import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogicComponentResolverComponent } from './logic-component-resolver.component';
import { LoggerService, LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponents } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { Component, ComponentRef } from '@angular/core';
import { LOGIC_SCREEN_COMPONENTS } from './logic-component-resolver.const';

@Component({
  template: '<ng-container #componentContainer></ng-container>',
})
class TestComponent {}

Object.defineProperties(LOGIC_SCREEN_COMPONENTS, {
  RestCall: {
    value: TestComponent,
  },
});

describe('LogicComponentResolverComponent', () => {
  let component: LogicComponentResolverComponent;
  let fixture: ComponentFixture<LogicComponentResolverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogicComponentResolverComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicComponentResolverComponent);
    component = fixture.componentInstance;

    component.componentDto = {
      type: 'RestCall',
    } as LogicComponents;

    fixture.detectChanges();

    jest.spyOn(component.componentContainer, 'createComponent').mockImplementation(() => {
      return {
        instance: {},
      } as ComponentRef<TestComponent>;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit()', () => {
    component.ngAfterViewInit();

    expect(component.componentContainer.createComponent).toHaveBeenCalled();
    expect(component.componentRef.instance.componentDto).toEqual(component.componentDto);
    expect(component.componentRef.instance.hasLoaded.value).toEqual(false);
  });

  it('ngAfterViewInit() - wrong component type', () => {
    component.componentDto = {
      type: 'Test',
    } as LogicComponents;

    const handlingSpy = jest.spyOn<any, any>(component, 'handleComponentNotSupported');

    component.ngAfterViewInit();

    expect(handlingSpy).toHaveBeenCalled();
  });
});
