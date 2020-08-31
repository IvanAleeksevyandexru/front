import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../../../../../../../../services/config/constructor-config.service.stub';
import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { FormsModule } from '@angular/forms';


describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationAddrComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrComponent>;
  let constructorConfigService: ConstructorConfigService;
  const mockData: TemporaryRegistrationAddrComponentInterface = {
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
        ScreenComponentService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    })
    .compileComponents();
    constructorConfigService = TestBed.inject(ConstructorConfigService);
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
