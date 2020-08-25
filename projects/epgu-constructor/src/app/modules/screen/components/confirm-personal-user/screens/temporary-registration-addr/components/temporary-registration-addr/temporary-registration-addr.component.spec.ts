import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrDisplayInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface'
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service'
import { ConstructorConfigServiceStub } from '../../../../../../../../services/config/constructor-config.service.stub'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'


describe('TemporaryRegistrationAddrComponent', () => {
  let component: TemporaryRegistrationAddrComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrComponent>;
  let constructorConfigService: ConstructorConfigService;
  const mockData: TemporaryRegistrationAddrDisplayInterface = {
    attrs: {
      actions: [],
      fields: [],
      hints: []
    },
    id: '',
    label: '',
    type: '',
    value: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ TemporaryRegistrationAddrComponent ],
      providers: [
        {provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub}
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
