import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';

describe('ConfirmPersonalUserEmailComponent', () => {
  let component: ConfirmPersonalUserEmailScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserEmailScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserEmailScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserEmailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
