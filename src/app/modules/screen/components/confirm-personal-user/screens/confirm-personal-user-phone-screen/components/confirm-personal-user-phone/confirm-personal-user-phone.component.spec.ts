import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserPhoneComponent } from './confirm-personal-user-phone.component';

describe('ConfirmPersonalUserPhoneComponent', () => {
  let component: ConfirmPersonalUserPhoneComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
