import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib'

import { ConfirmChildAddressComponent } from './confirm-child-address.component';


describe('ConfirmChildAddressComponent', () => {
  let component: ConfirmChildAddressComponent;
  let fixture: ComponentFixture<ConfirmChildAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ ConfirmChildAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmChildAddressComponent);
    component = fixture.componentInstance;
    component.userAddress = '';
    component.actions = '';
    component.childrenData = [{registrationAddress: 'sd', registrationAddressDate: 'fs'}];
    component.data = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
