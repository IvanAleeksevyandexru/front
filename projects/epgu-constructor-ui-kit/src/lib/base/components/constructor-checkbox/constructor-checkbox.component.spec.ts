import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormControlDirective } from '@angular/forms';
import { ConstructorCheckboxComponent } from './constructor-checkbox.component';
import { BaseUiModule } from '../../base-ui.module';
import { By } from '@angular/platform-browser';

describe('ConstructorCheckboxComponent', () => {
  let component: ConstructorCheckboxComponent;
  let fixture: ComponentFixture<ConstructorCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorCheckboxComponent],
      imports: [BaseUiModule],
      providers: [],
    }).compileComponents();
  });

  let control: FormControl;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorCheckboxComponent);
    component = fixture.componentInstance;
    component.checkboxId = '123';
    component.control = control = new FormControl();
    component.labelText = 'some label text';
    component.required = true;
    component.hidden = true;
    fixture.detectChanges();
  });

  it('should render lib-checkbox', () => {
    const selector = 'lib-checkbox';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.checkboxId).toBe('123');
    expect(debugEl.injector.get(FormControlDirective).form).toBe(control);
    expect(debugEl.componentInstance.labelText).toBe('some label text');
    expect(debugEl.componentInstance.required).toBeTruthy();
    expect(debugEl.nativeElement.hidden).toBeTruthy();
    expect(debugEl.componentInstance.disabled).toBeFalsy();

    component.required = false;
    component.hidden = false;
    control.disable();
    fixture.detectChanges();

    expect(debugEl.componentInstance.required).toBeFalsy();
    expect(debugEl.nativeElement.hidden).toBeFalsy();
    expect(debugEl.componentInstance.disabled).toBeTruthy();
  });
});
