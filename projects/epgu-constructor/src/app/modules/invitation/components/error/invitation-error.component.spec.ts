import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import {InvitationErrorComponent} from './invitation-error.component';

describe('ErrorsBlockScreenComponent', () => {
  let component: InvitationErrorComponent;
  let fixture: ComponentFixture<InvitationErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
