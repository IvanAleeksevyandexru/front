import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserScreenLayoutComponent } from './confirm-personal-user-screen-layout.component';

describe('ConfirmPersonalUserScreenLayoutComponent', () => {
  let component: ConfirmPersonalUserScreenLayoutComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserScreenLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserScreenLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
