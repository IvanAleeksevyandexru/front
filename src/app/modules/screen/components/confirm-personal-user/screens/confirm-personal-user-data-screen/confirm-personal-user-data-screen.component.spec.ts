import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';

describe('ConfirmPersonalUserDataScreenComponent', () => {
  let component: ConfirmPersonalUserDataScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserDataScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
