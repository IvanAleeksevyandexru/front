import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmChildAddressComponent } from './confirm-child-address.component';

describe('ConfirmChildAddressComponent', () => {
  let component: ConfirmChildAddressComponent;
  let fixture: ComponentFixture<ConfirmChildAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmChildAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmChildAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
