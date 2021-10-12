import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    component.data = new FormControl();
    fixture.detectChanges();
  });

  it('should render msg error if invalid and touched', () => {
    component.data.setErrors({
      msg: 'some msg',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML.includes('some msg')).toBeFalsy();

    component.data.markAsTouched();
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML.includes('some msg')).toBeTruthy();
  });

  it('should render serverError if has serverError', () => {
    component.data.setErrors({
      serverError: 'some server error',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML.includes('some server error')).toBeTruthy();
  });
});
