import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationModalBaseComponent } from './confirmation-modal-base.component';

xdescribe('ConfirmationModalBaseComponent', () => {
  let component: ConfirmationModalBaseComponent;
  let fixture: ComponentFixture<ConfirmationModalBaseComponent>;

  beforeEach(waitForAsync(()=> {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationModalBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
