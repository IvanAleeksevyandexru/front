import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ActionType, DTOActionAction, ScreenButton, System } from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  EventBusService,
  EventBusServiceStub,
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

describe('ScreenButtonsComponent', () => {
  let component: ScreenButtonsComponent;
  let fixture: ComponentFixture<ScreenButtonsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let deviceDetectorServiceSpy: jest.SpyInstance;

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
      imports: [BaseModule],
      declarations: [DisabledButtonPipe, ScreenButtonsComponent, ShowLoaderButtonPipe],
      providers: [
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: EventBusService, useClass: EventBusServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    })
      .overrideComponent(ScreenButtonsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    deviceDetectorServiceSpy = jest.spyOn(deviceDetectorService, 'system', 'get');
    createComponent();
    fixture.detectChanges();
  });

  it('should set clientSystem', () => {
    deviceDetectorServiceSpy.mockReturnValue(System.Android);
    createComponent();

    expect((component as any).clientSystem).toEqual(System.Android);
  });

  it('should set shownButtons by filtered screenButtons', () => {
    deviceDetectorServiceSpy.mockReturnValue(System.Android);
    createComponent();

    expect(component.shownButtons.length).toEqual(4);
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
      deviceDetectorServiceSpy.mockReturnValue(System.iOS);
      createComponent();
      fixture.detectChanges();
      const debugElements = fixture.debugElement.queryAll(By.css('.screen-button'));

      expect(debugElements.length).toBe(3);
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

      expect(setClickedButtonSpy).toBeCalledWith(component.shownButtons[0]);
      expect(component.clickedButton).toBe(component.shownButtons[0]);
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
      component.clickedButton = component.shownButtons[1];
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
