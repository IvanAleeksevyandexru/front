import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../../../shared/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../shared/config/config.service.stub';
import { UnsubscribeService } from '../../../../../../../../shared/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { TemporaryRegistrationComponent } from '../../temporary-registration-addr-screen.types';
import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';


describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationAddrComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrComponent>;
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ TemporaryRegistrationAddrComponent ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
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
