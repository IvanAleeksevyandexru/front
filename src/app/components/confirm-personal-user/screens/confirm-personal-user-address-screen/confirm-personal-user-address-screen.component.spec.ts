import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserAddressScreenComponent } from './confirm-personal-user-address-screen.component';

describe('ConfirmPersonalUserAddressScreenComponent', () => {
  let component: ConfirmPersonalUserAddressScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserAddressScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
