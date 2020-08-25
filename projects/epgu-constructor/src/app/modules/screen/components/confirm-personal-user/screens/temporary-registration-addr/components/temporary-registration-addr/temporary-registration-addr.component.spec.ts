import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../../../interfaces/temporary-registration-addr.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../../../../../../../../services/config/constructor-config.service.stub';
import { TemporaryRegistrationAddrComponent } from './temporary-registration-addr.component';




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
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
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
