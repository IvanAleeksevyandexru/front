import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ConfirmUserData } from '../../../../../../types/confirm-user-data.types';
import { ToJsonPipe } from '../../../../../../../../shared/pipes/toJson/to-json.pipe';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ConfigServiceStub } from '../../../../../../../../config/config.service.stub';

describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  const mockData: ConfirmUserData = {
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
      providers: [ ComponentStateService, { provide: ConfigService, useClass: ConfigServiceStub } ]
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
