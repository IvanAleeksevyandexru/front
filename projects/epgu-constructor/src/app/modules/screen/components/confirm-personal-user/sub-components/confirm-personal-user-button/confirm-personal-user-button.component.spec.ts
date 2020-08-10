import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserButtonComponent } from './confirm-personal-user-button.component';

describe('ConfirmPersonalUserButtonComponent', () => {
  let component: ConfirmPersonalUserButtonComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
