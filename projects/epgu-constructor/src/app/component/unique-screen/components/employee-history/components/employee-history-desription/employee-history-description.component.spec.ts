import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { of } from 'rxjs';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DisplayDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../../screen/screen.types';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { ConstructorMonthPickerModule } from '../../../../shared/components/constructor-month-picker/constructor-month-picker.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { Gender } from '../../../../shared/types/gender';
import { EmployeeHistoryDescriptionComponent } from './employee-history-description.component';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { EmployeeHistoryMonthsService } from './services/employee-history.months.service';

xdescribe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryDescriptionComponent;
  let fixture: ComponentFixture<EmployeeHistoryDescriptionComponent>;
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
        ConstructorCheckboxModule,
      ],

      declarations: [
        EmployeeHistoryDescriptionComponent,
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
        EventBusService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryDescriptionComponent);
    fixture.debugElement.injector.get(EmployeeHistoryFormService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(EmployeeHistoryDatasourceService);
    fixture.debugElement.injector.get(EmployeeHistoryMonthsService);

    component = fixture.componentInstance;
    component.display$ = of(mockDisplay);
    component.header$ = of('');
    component.gender$ = of(Gender.male);
    // spyOn(formService, 'createEmployeeForm')
    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
