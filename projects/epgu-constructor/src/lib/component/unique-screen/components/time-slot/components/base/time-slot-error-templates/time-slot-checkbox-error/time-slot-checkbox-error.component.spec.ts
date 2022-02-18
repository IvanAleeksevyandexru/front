import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  ConstructorCheckboxModule,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  ModalService,
  ModalServiceStub,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';
import { TimeSlotCheckboxErrorComponent } from './time-slot-checkbox-error.component';
import { ScreenButtonsModule } from '../../../../../../../../shared/components/screen-buttons/screen-buttons.module';
import { BaseComponentsModule } from '../../../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { ErrorTemplate } from '../../../../typings';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../../screen/current-answers-service.stub';
import { HtmlSelectService } from '../../../../../../../../core/services/html-select/html-select.service';
import { HtmlSelectServiceStub } from '../../../../../../../../core/services/html-select/html-select.service.stub';
import { ActionServiceStub } from '../../../../../../../../shared/directives/action/action.service.stub';
import { ActionService } from '../../../../../../../../shared/directives/action/action.service';
import { EaisdoGroupCostServiceStub } from '../../../../../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service.stub';
import { EaisdoGroupCostService } from '../../../../../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { MockProvider } from 'ng-mocks';
import { CertificateEaisdoService } from '../../../../../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import { ScreenButtonService } from '../../../../../../../../shared/components/screen-buttons/screen-button.service';
import { ScreenButtonServiceStub } from '../../../../../../../../shared/components/screen-buttons/screen-button.service.stub';

const mockTemplate: ErrorTemplate = {
  header: 'test',
  description: 'test-description',
  checkboxLabel: 'test-checkboxLabel',
  button: { label: 'button-test' } as ScreenButton,
};
describe('TimeSlotCheckboxErrorComponent', () => {
  let component: TimeSlotCheckboxErrorComponent;
  let fixture: ComponentFixture<TimeSlotCheckboxErrorComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotCheckboxErrorComponent],
      imports: [BaseModule, BaseComponentsModule, ConstructorCheckboxModule, ScreenButtonsModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ScreenButtonService, useClass: ScreenButtonServiceStub },
        { provide: HtmlSelectService, useClass: HtmlSelectServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: EaisdoGroupCostService, useClass: EaisdoGroupCostServiceStub },
        MockProvider(CertificateEaisdoService),
        JsonHelperService,
        EventBusService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    fixture = TestBed.createComponent(TimeSlotCheckboxErrorComponent);
    component = fixture.componentInstance;
    component.error = mockTemplate;
    jest.spyOn(screenService, 'buttons', 'get').mockReturnValue([]);
  });

  describe('base', () => {
    it('should be text', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.text'))?.nativeElement?.innerHTML?.trim()).toBe(
        'testtest-description',
      );
    });
    it('should be show button', () => {
      component.checkbox.setValue(true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.screen-button span'))?.nativeElement?.innerHTML?.trim(),
      ).toBe(mockTemplate.button.label);
    });
    it('should be show checkbox', () => {
      component.checkbox.setValue(true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.text-plain'))?.nativeElement?.innerHTML?.trim(),
      ).toBe(mockTemplate.checkboxLabel);
    });
  });
});
