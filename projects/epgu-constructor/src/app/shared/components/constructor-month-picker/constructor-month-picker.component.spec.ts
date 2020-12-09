import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConstructorMonthPickerComponent } from './constructor-month-picker.component';
import { CoreModule } from '../../../core/core.module';

describe('ConstructorMonthPickerComponent', () => {
  let component: ConstructorMonthPickerComponent;
  let fixture: ComponentFixture<ConstructorMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorMonthPickerComponent],
      imports: [CoreModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMonthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
