import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCreatedRequestScreenComponent } from './confirm-created-request-screen.component';

describe('ConfirmCreatedRequestScreenComponent', () => {
  let component: ConfirmCreatedRequestScreenComponent;
  let fixture: ComponentFixture<ConfirmCreatedRequestScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmCreatedRequestScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCreatedRequestScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
