import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ConfirmUserDataInterface } from '../../../../../../../../../interfaces/confirm-user-data.interface'
import { ToJsonPipe } from '../../../../../../../../shared-module/pipe/toJson/to-json.pipe'
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service'
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service'
import { ConstructorConfigServiceStub } from '../../../../../../../../services/config/constructor-config.service.stub'

describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  const mockData: ConfirmUserDataInterface = {
    attrs: {
      actions: [
        {
          label: '',
          method: ''
        }
      ],
      fields: [
        {
          fieldName: 'birthDate',
          label: 'Birthday Date'
        }
      ]
    },
    type: '',
    value: '',
    label: '',
    id: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserDataComponent, ToJsonPipe ],
      providers: [ ScreenComponentService, {provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
