import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ConfigServiceStub } from '../../../../../../../../config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ToJsonPipe } from '../../../../../../../../shared/pipes/toJson/to-json.pipe';
import { ConfirmUserData } from '../../../../../../types/confirm-user-data.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';


describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  const mockData: ConfirmUserData = {
    attrs: {
      actions: [
        {
          label: '',
          value: '',
          action: ''
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
      providers: [ CurrentAnswersService, { provide: ConfigService, useClass: ConfigServiceStub } ]
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
