import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporaryRegistrationComponent } from '../../temporary-registration-addr-screen.types';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ConfigServiceStub } from '../../../../../../../../config/config.service.stub';
import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { FormsModule } from '@angular/forms';


describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationComponent;
  let fixture: ComponentFixture<TemporaryRegistrationComponent>;
  let configService: ConfigService;
  const mockData: TemporaryRegistrationComponent = {
    attrs: {
      actions: [],
      fields: [],
      hints: []
    },
    id: '',
    label: '',
    type: '',
    value: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [FormsModule],
      declarations: [ TemporaryRegistrationAddrComponent ],
      providers: [
        UnsubscribeService,
        ComponentStateService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    })
    .compileComponents();
    configService = TestBed.inject(ConfigService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRegistrationAddrComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
