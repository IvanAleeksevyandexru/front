import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoggerService, LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';

import { GenderOrder, GenderRadioButtonComponent } from './gender-radio-button.component';

describe('GenderRadioButtonComponent', () => {
  let component: GenderRadioButtonComponent;
  let fixture: ComponentFixture<GenderRadioButtonComponent>;
  let loggerService: LoggerService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [GenderRadioButtonComponent],
      providers: [{ provide: LoggerService, useClass: LoggerServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    loggerService = TestBed.inject(LoggerService);
    fixture = TestBed.createComponent(GenderRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be writeValue', () => {
    component.writeValue('a');
    expect(component.innerValue).toBe('a');
    component.writeValue(false);
    expect(component.innerValue).toBe(GenderOrder.male);
    component.writeValue(2);
    expect(component.innerValue).toBe(2);
  });

  it('should be registerOnChange', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    expect(component.onChange).toBe(fn);
  });

  it('should be registerOnTouched', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    expect(component.onTouched).toBe(fn);
  });

  it('should be change', () => {
    jest.spyOn(loggerService, 'error');
    component.change({ value: 'a' });
    expect(loggerService.error).toHaveBeenCalled();
    const fnChange = jest.fn();
    const fnTouched = jest.fn();
    const test = 'a';
    component.registerOnChange(fnChange);
    component.registerOnTouched(fnTouched);
    component.change({ value: test });
    expect(fnChange).toHaveBeenCalledWith(test);
    expect(fnTouched).toHaveBeenCalledWith(test);
  });
});
