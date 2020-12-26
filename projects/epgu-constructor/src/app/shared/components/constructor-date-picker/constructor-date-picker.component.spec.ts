import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';

describe('ConstructorDatePickerComponent', () => {
  let component: ConstructorDatePickerComponent;
  let fixture: ComponentFixture<ConstructorDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructorDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
