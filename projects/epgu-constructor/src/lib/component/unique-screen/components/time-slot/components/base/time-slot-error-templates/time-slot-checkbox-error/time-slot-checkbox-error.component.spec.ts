import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotCheckboxErrorComponent } from './time-slot-checkbox-error.component';
import {
  ConfigService,
  ConfigServiceStub,
  ConstructorCheckboxModule,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenButtonsModule } from '../../../../../../../../shared/components/screen-buttons/screen-buttons.module';
import { BaseComponentsModule } from '../../../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import { MockModule } from 'ng-mocks';
import { ErrorTemplate } from '../../../../typings';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../../screen/current-answers-service.stub';
import { HtmlSelectService } from '../../../../../../../../core/services/html-select/html-select.service';
import { HtmlSelectServiceStub } from '../../../../../../../../core/services/html-select/html-select.service.stub';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { By } from '@angular/platform-browser';
import { ActionServiceStub } from '../../../../../../../../shared/directives/action/action.service.stub';
import { ActionService } from '../../../../../../../../shared/directives/action/action.service';
import { FormControl } from '@angular/forms';
import { ymaps } from '@epgu/epgu-constructor-ui-kit/src/lib/base/components/yandex-map/yandex-map.types';
import control = ymaps.control;

const mockTemplate: ErrorTemplate = {
  header: 'test',
  description: 'test-description',
  checkboxLabel: 'test-checkboxLabel',
  button: { label: 'button-test' } as ScreenButton,
};
describe('TimeSlotCheckboxErrorComponent', () => {
  let component: TimeSlotCheckboxErrorComponent;
  let fixture: ComponentFixture<TimeSlotCheckboxErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotCheckboxErrorComponent],
      imports: [BaseModule, BaseComponentsModule, ConstructorCheckboxModule, ScreenButtonsModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: HtmlSelectService, useClass: HtmlSelectServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        JsonHelperService,
        EventBusService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotCheckboxErrorComponent);
    component = fixture.componentInstance;
    component.error = mockTemplate;
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
