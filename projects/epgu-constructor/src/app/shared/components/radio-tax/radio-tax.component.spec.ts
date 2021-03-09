import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioTaxComponent } from './radio-tax.component';

describe('RadioTaxComponent', () => {
  let component: RadioTaxComponent;
  let fixture: ComponentFixture<RadioTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioTaxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTaxComponent);
    component = fixture.componentInstance;
    component.payment = {
      uin: '18810177170325189254',
      payDate: 1559682000000,
      title: 'ШТРАФ ПО ПРАВОНАРУШЕНИЮ ПОСТАНОВЛЕНИЕ №18810177170325189254. Оплата со скидкой 50%',
      amount: 1500.0,
      link: 'https://lk.gosuslugi.ru/notifications/details/PAYMENT/1461358',
      invitationAddress: 'г. Москва, ул. Смоленская, д 3. кв. 100',
    };
    fixture.detectChanges();
  });

  it('should be call paymentSelectEvent with select item', () => {
    jest.spyOn(component.paymentSelectEvent, 'emit');
    component.onSelect();
    expect(component.paymentSelectEvent.emit).toHaveBeenCalledWith(component.payment);
  });
});
