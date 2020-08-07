import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';

describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationAddrComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryRegistrationAddrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRegistrationAddrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
