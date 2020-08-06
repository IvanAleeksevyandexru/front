import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';

describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationAddrScreenComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporaryRegistrationAddrScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRegistrationAddrScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
