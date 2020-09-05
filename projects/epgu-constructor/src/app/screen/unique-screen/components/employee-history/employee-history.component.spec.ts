import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeHistoryComponent } from './employee-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { ButtonComponent, CheckboxComponent, DatePickerComponent, PlainInputComponent, RadioComponent } from 'epgu-lib';
import { PageNameComponent } from '../../../../shared/components/page-name/page-name.component';
import { LabelComponent } from '../../../../shared/components/label/label.component';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { NavigationService } from '../../../../shared/services/navigation/navigation.service';
import { MockComponent } from 'ng-mocks';
import { SCREEN_TYPE } from '../../../../shared/constant/global';

describe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryComponent;
  let fixture: ComponentFixture<EmployeeHistoryComponent>;
  let RadioComponentMock = MockComponent(RadioComponent);
  let DatePickerComponentMock = MockComponent(DatePickerComponent);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeHistoryComponent,
        CheckboxComponent,
        DatePickerComponentMock,
        PlainInputComponent,
        PageNameComponent,
        LabelComponent,
        RadioComponentMock,
        ButtonComponent,
        NavigationComponent,
        ScreenContainerComponent,
      ],
      imports: [ ReactiveFormsModule ],
      providers: [ EmployeeHistoryFormService, UnsubscribeService, EmployeeHistoryDatasourceService, NavigationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let formService = TestBed.inject(EmployeeHistoryFormService);
    fixture = TestBed.createComponent(EmployeeHistoryComponent);
    component = fixture.componentInstance;
    component.data = {
      components: [],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: SCREEN_TYPE.UNIQUE,
    };
    component.header = '';
    component.gender = 'M';
    // spyOn(formService, 'createEmployeeForm')
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
