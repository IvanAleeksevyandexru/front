import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';

describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
