import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormControlDirective } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { BaseModule } from '../../base.module';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('ConstructorDropdownComponent', () => {
  let component: ConstructorDropdownComponent;
  let fixture: ComponentFixture<ConstructorDropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorDropdownComponent],
      imports: [BaseModule],
      providers: [
      ],
    }).overrideComponent(ConstructorDropdownComponent,{
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  let control: FormControl;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDropdownComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = control = new FormControl();
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.clearable = false;
    component.disabled = false;
    component.localSearch = false;
    component.placeholder = '&mdash;';
    component.items = [];
    fixture.detectChanges();
  });

  it('should render lib-dropdown', () => {
    const selector = 'lib-dropdown';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.id).toBe('123');
    expect(debugEl.componentInstance.invalid).toBeFalsy();
    expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.IMMEDIATE);
    expect(debugEl.componentInstance.disabled).toBeFalsy();
    expect(debugEl.componentInstance.clearable).toBeFalsy();
    expect(debugEl.componentInstance.localSearch).toBeFalsy();
    expect(debugEl.componentInstance.placeholder).toBe('&mdash;');
    expect(debugEl.componentInstance.items).toEqual([]);
    expect(debugEl.injector.get(FormControlDirective).form).toBe(control);

    component.id = '456';
    component.invalid = true;
    component.validationShowOn = ValidationShowOn.NEVER;
    component.clearable = true;
    component.disabled = true;
    component.localSearch = true;
    component.placeholder = '---';
    component.items = [{
      id: 1,
      text: 'some text'
    }];
    fixture.detectChanges();

    expect(debugEl.nativeElement.id).toBe('456');
    expect(debugEl.componentInstance.invalid).toBeTruthy();
    expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.NEVER);
    expect(debugEl.componentInstance.disabled).toBeTruthy();
    expect(debugEl.componentInstance.clearable).toBeTruthy();
    expect(debugEl.componentInstance.localSearch).toBeTruthy();
    expect(debugEl.componentInstance.placeholder).toBe('---');
    expect(debugEl.componentInstance.items).toEqual([{
      id: 1,
      text: 'some text'
    }]);
  });

  it('should emit changed event', () => {
    jest.spyOn(component.changed, 'emit');

    const selector = 'lib-dropdown';
    const debugEl = fixture.debugElement.query(By.css(selector));
    debugEl.triggerEventHandler('changed', {
      id: 1,
      text: 'some text'
    });

    expect(component.changed.emit).toBeCalledTimes(1);
    expect(component.changed.emit).toBeCalledWith({
      id: 1,
      text: 'some text'
    });
  });
});
