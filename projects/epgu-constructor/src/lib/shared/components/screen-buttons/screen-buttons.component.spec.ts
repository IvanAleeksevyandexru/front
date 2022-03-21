import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  ActionType,
  DisplayDto,
  DTOActionAction,
  ScreenButton,
  ScreenTypes,
  System,
} from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../directives/action/action.service';
import { ActionServiceStub } from '../../directives/action/action.service.stub';
import { BaseModule } from '../../base.module';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../screen/current-answers-service.stub';
import { DisabledButtonPipe } from './pipes/disabled-button.pipe';
import { ScreenButtonsComponent } from './screen-buttons.component';
import { ShowLoaderButtonPipe } from './pipes/show-loader-button.pipe';
import { EaisdoGroupCostServiceStub } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service.stub';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { MockProvider } from 'ng-mocks';
import { CertificateEaisdoService } from '../../services/certificate-eaisdo/certificate-eaisdo.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenButtonService } from './screen-button.service';
import { ForTestsOnlyModule } from '../../../core/for-tests-only.module';

describe('ScreenButtonsComponent', () => {
  let component: ScreenButtonsComponent;
  let fixture: ComponentFixture<ScreenButtonsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let deviceDetectorServiceSpy: jest.SpyInstance;
  let screenService: ScreenService;
  let buttonsService: ScreenButtonService;

  const mockScreenButtons: ScreenButton[] = [
    {
      action: DTOActionAction.redirect,
      type: ActionType.home,
      label: 'На главную',
    },
    {
      action: DTOActionAction.getNextStep,
      type: ActionType.nextStep,
      label: 'Далее',
    },
    {
      action: DTOActionAction.getNextStep,
      type: ActionType.nextStep,
      label: 'Кнопка для Android',
      attrs: {
        showOnOS: [System.Android],
      },
    },
    {
      action: DTOActionAction.getNextStep,
      type: ActionType.nextStep,
      label: 'Кнопка для Android и iOS',
      attrs: {
        showOnOS: [System.Android, System.iOS],
      },
    },
    {
      action: DTOActionAction.getNextStep,
      type: ActionType.nextStep,
      label: 'Кнопка для Desktop',
      attrs: {
        showOnOS: [System.Desktop],
      },
    },
  ];

  const createComponent = () => {
    fixture = TestBed.createComponent(ScreenButtonsComponent);
    component = fixture.componentInstance;
    component.screenButtons = mockScreenButtons;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseModule, ForTestsOnlyModule],
      declarations: [DisabledButtonPipe, ScreenButtonsComponent, ShowLoaderButtonPipe],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: EaisdoGroupCostService, useClass: EaisdoGroupCostServiceStub },
        MockProvider(CertificateEaisdoService),
        MockProvider(ScreenService),
      ],
    })
      .overrideComponent(ScreenButtonsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    jest
      .spyOn(screenService, 'display', 'get')
      .mockReturnValue(({ type: ScreenTypes.CUSTOM } as unknown) as DisplayDto);

    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    deviceDetectorServiceSpy = jest.spyOn(deviceDetectorService, 'system', 'get');
    createComponent();
    buttonsService = fixture.debugElement.injector.get(ScreenButtonService);
    jest.spyOn(screenService, 'buttons', 'get').mockReturnValue([]);
    fixture.detectChanges();
  });

  it('should set shownButtons by filtered screenButtons', () => {
    buttonsService['clientSystem'] = System.Android;
    component.screenButtons = mockScreenButtons;

    expect(buttonsService.outputButtons.length).toEqual(2);
  });

  describe('render', () => {
    it('should render two buttons', () => {
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));
      expect(debugElements.length).toBe(2);
    });

    it('should render one button', () => {
      component.screenButtons = [
        {
          action: DTOActionAction.getNextStep,
          type: ActionType.nextStep,
          label: 'Далее',
        },
      ];
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));

      expect(debugElements.length).toBe(1);
    });

    it('should render buttons filtered for client system', () => {
      buttonsService['clientSystem'] = System.iOS;
      component.screenButtons = mockScreenButtons;
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));

      expect(debugElements.length).toBe(2);
    });

    it('should have button labels', () => {
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));

      expect(debugElements[0].nativeElement.textContent.trim()).toBe('На главную');
      expect(debugElements[1].nativeElement.textContent.trim()).toBe('Далее');
    });

    it('should call setClickedButton when click on button and set clickedButton', () => {
      const setClickedButtonSpy = jest.spyOn(component, 'setClickedButton');
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));
      debugElements[0].nativeElement.click();

      expect(setClickedButtonSpy).toBeCalledWith(buttonsService.outputButtons[0]);
      expect(component.clickedButton).toBe(buttonsService.outputButtons[0]);
    });

    it('should disable all buttons when isLoading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));

      expect(debugElements[0].nativeElement.disabled).toBeTruthy();
      expect(debugElements[1].nativeElement.disabled).toBeTruthy();
    });

    it('should add loaded class for clickedButton', () => {
      component.isLoading = true;
      component.clickedButton = buttonsService.outputButtons[1];
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));

      expect(debugElements[0].classes.loader).toBeFalsy();
      expect(debugElements[1].classes.loader).toBeTruthy();
    });

    it('should disable all buttons when disabled and disabledForAll', () => {
      component.isLoading = false;
      component.disabled = true;
      component.disabledForAll = true;
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));

      expect(debugElements[0].nativeElement.disabled).toBeTruthy();
      expect(debugElements[1].nativeElement.disabled).toBeTruthy();
    });

    it('should disable only for next screen buttons when disabled and not disabledForAll', () => {
      component.isLoading = false;
      component.disabled = true;
      component.disabledForAll = false;
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button button'));

      expect(debugElements[0].nativeElement.disabled).toBeFalsy();
      expect(debugElements[1].nativeElement.disabled).toBeTruthy();
    });
  });
});
