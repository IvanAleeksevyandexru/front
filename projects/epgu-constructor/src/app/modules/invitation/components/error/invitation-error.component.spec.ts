import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib'

import { IAttrsError, InvitationErrorComponent } from './invitation-error.component'



describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData: IAttrsError = {msg: '', url: ''};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ InvitationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    component = fixture.componentInstance;
    component.attrs = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
