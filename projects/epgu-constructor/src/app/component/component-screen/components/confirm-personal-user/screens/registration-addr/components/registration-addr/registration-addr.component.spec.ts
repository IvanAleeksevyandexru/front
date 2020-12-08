import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from '../../../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../../../core/config/config.service.stub';
import { UnsubscribeService } from '../../../../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
// eslint-disable-next-line max-len
import { ConstructorPlainInputModule } from '../../../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { IRegistrationAddrComponent } from '../../registration-addr-screen.types';
import { RegistrationAddrComponent } from './registration-addr.component';



describe('RegistrationAddrComponent', () => {
  let component: RegistrationAddrComponent;
  let fixture: ComponentFixture<RegistrationAddrComponent>;
  let configService: ConfigService;
  const mockData: IRegistrationAddrComponent = {
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
      imports: [FormsModule, ReactiveFormsModule, ConstructorPlainInputModule, RouterTestingModule],
      declarations: [ RegistrationAddrComponent ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    })
    .compileComponents();
    configService = TestBed.inject(ConfigService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationAddrComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});