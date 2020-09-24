import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
import { InvitationErrorComponent } from './invitation-error.component';


describe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  const mockData: any = { label: '', attrs: { url: '' }};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [InvitationErrorComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
