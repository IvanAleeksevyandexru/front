import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeHistoryContainerComponent } from '../../employee-history/container/employee-history-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { AppealFinesContainerComponent } from './appeal-fines-container.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { AppealFinesComponent } from '../components/appeal-fines.component';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { CustomScreenComponentTypes } from '../../../../custom-screen/components-list.types';

describe('EmployeeHistoryContainerComponent', () => {
  let component: AppealFinesContainerComponent;
  let fixture: ComponentFixture<AppealFinesContainerComponent>;
  let screenService: ScreenService;
  const mockComponent = {
    id: '',
    type: UniqueScreenComponentTypes.appealFines,
    label: '',
    attrs: {
      components: [
        {
          type: CustomScreenComponentTypes.TextArea,
          attrs: { }
        },
        {
          id: '',
          type: UniqueScreenComponentTypes.fileUploadComponent,
          label: '',
          attrs: { uploads: [] },
        },
        {
          id: '',
          type: UniqueScreenComponentTypes.fileUploadComponent,
          label: '',
          attrs: { uploads: [] },
        }
      ],
    }

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppealFinesContainerComponent,
        MockComponent(AppealFinesComponent),
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealFinesContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
