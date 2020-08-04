import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserEmailComponent } from './confirm-personal-user-email.component';

describe('ConfirmPersonalUserEmailComponent', () => {
  let component: ConfirmPersonalUserEmailComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
