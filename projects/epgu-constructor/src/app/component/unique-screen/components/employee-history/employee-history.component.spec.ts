import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenTypes } from '../../../../screen/screen.types';
import { EmployeeHistoryComponent } from './employee-history.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNameComponent } from '../../../../shared/components/base/page-name/page-name.component';
import { LabelComponent } from '../../../../shared/components/base/label/label.component';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EpguLibModule } from 'epgu-lib';
import { Gender } from '../../../../shared/types/gender';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';

xdescribe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryComponent;
  let fixture: ComponentFixture<EmployeeHistoryComponent>;
  let mockDisplay: DisplayDto = {
    components: [],
    subHeader: { text: '', clarifications: {}},
    header: '',
    label: '',
    id: '',
    name: '',
    displayCssClass: '',
    submitLabel: '',
    terminal: false,
    type: ScreenTypes.UNIQUE,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EpguLibModule,
        ConstructorPlainInputModule,
        ConstructorMonthPickerModule,
      ],
      declarations: [
        EmployeeHistoryComponent,
        PageNameComponent,
        LabelComponent,
        NavigationComponent,
        ScreenContainerComponent,
      ],
      providers: [
        EmployeeHistoryFormService,
        UnsubscribeService,
        EmployeeHistoryDatasourceService,
        EmployeeHistoryMonthsService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryComponent);
    fixture.debugElement.injector.get(EmployeeHistoryFormService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(EmployeeHistoryDatasourceService);
    fixture.debugElement.injector.get(EmployeeHistoryMonthsService);

    component = fixture.componentInstance;
    component.display = mockDisplay;
    component.header = '';
    component.gender = Gender.male;
    // spyOn(formService, 'createEmployeeForm')
    fixture.detectChanges();
  });


  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
