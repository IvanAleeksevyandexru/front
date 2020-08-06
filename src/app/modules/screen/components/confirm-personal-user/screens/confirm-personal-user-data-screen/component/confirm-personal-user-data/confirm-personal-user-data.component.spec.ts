import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';

describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
