import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeSelectorComponent } from './payment-type-selector.component';

describe('PaymentTypeSelectorComponent', () => {
  let component: PaymentTypeSelectorComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentTypeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
