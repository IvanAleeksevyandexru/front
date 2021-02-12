import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppealFinesComponent } from './appeal-fines.component';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { CustomScreenComponentTypes } from '../../../../shared/components/components-list/components-list.types';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { MockComponent, MockModule } from 'ng-mocks';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
// eslint-disable-next-line max-len
import { ConstructorMultilineInputComponent } from '../../../../../shared/components/constructor-multiline-input/constructor-multiline-input.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { FileUploadComponent } from '../../file-upload-screen/sub-components/file-upload/file-upload.component';
import { EpguLibModule } from 'epgu-lib';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/components/components-list/services/date-range/date-range.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { By } from '@angular/platform-browser';

describe('AppealFinesComponent', () => {
  let component: AppealFinesComponent;
  let fixture: ComponentFixture<AppealFinesComponent>;
  let eventBusService: EventBusService;

  const mockComponents = [
    {
      type: CustomScreenComponentTypes.TextArea,
      attrs: {
        validation: [
          {
            type: 'RegExp',
            value: '.+',
            errorMsg: 'Поле не может быть пустым'
          },
        ]
      }
    },
    {
      id: '',
      type: UniqueScreenComponentTypes.fileUploadComponent,
      label: '',
      attrs: {  validation: [], uploads: [] },
    },
    {
      id: '',
      type: UniqueScreenComponentTypes.fileUploadComponent,
      label: '',
      attrs: { uploads: [] },
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppealFinesComponent,
        MockComponent(ConstructorMultilineInputComponent),
        ScreenPadComponent,
        MockComponent(FileUploadComponent),
      ],
      imports: [
        MockModule(BaseComponentsModule),
        MockModule(EpguLibModule)
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        ValidationService,
        UnsubscribeService,
        EventBusService,
        UnsubscribeService,
        DateRangeService,
        DatesToolsService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealFinesComponent);
    component = fixture.componentInstance;
    eventBusService = TestBed.inject(EventBusService);
    component.components = mockComponents as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render textArea', () => {
    const textAreaEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-multiline-input'));
    expect(textAreaEl).toBeTruthy();
  });

  it('should create formControl', () => {
    expect(component.formControl).toBeDefined();
  });

  // @TODO дописать
  describe('updateCurrentAnswerServiceValidationEvent', () => {
    it('should be not call, if form change invalid', () => {
      jest.spyOn(component.updateCurrentAnswerServiceValidationEvent, 'emit');
      expect(component.updateCurrentAnswerServiceValidationEvent.emit).toBeCalledTimes(0);
    });
    it('should call with false', () => {
      jest.spyOn(component.updateCurrentAnswerServiceValidationEvent, 'next');
      component.formControl.setValue('123');
      expect(component.updateCurrentAnswerServiceValidationEvent.next).toHaveBeenCalledWith(false);
    });
  });

  it('should call updateCurrentAnswerServiceStateEvent', () => {
    jest.spyOn(component.updateCurrentAnswerServiceStateEvent, 'next');
    component.formControl.setValue('1234');
    expect(component.updateCurrentAnswerServiceStateEvent.next).toHaveBeenCalled();
    expect(component.updateCurrentAnswerServiceStateEvent.next).toHaveBeenCalledWith('1234');
  });
});
