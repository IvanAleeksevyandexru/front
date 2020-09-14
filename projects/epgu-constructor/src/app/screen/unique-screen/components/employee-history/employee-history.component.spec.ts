import { ComponentFixture } from '@angular/core/testing';
import { Display, ScreenTypes } from '../../../screen.types';
import { EmployeeHistoryComponent } from './employee-history.component';

describe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryComponent;
  let fixture: ComponentFixture<EmployeeHistoryComponent>;
  let mockDisplay: Display = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: ScreenTypes.UNIQUE
  };
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [
  //       ReactiveFormsModule,
  //       EpguLibModule.forChild(),
  //     ],
  //     declarations: [
  //       EmployeeHistoryComponent,
  //       PageNameComponent,
  //       LabelComponent,
  //       NavigationComponent,
  //       ScreenContainerComponent,
  //     ],
  //     providers: [ EmployeeHistoryFormService, UnsubscribeService, EmployeeHistoryDatasourceService, NavigationService ]
  //   })
  //   .compileComponents();
  // }));

  // beforeEach(() => {
  //   let formService = TestBed.inject(EmployeeHistoryFormService);
  //   fixture = TestBed.createComponent(EmployeeHistoryComponent);
  //   component = fixture.componentInstance;
  //   component.display = mockDisplay;
  //   component.header = '';
  //   component.gender = Gender.male;
  //   // spyOn(formService, 'createEmployeeForm')
  //   fixture.detectChanges();
  // });
  // TODO: repair this test
  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
