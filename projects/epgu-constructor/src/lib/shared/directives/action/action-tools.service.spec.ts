import { TestBed } from '@angular/core/testing';
import { ActionToolsService } from './action-tools.service';
import { DTOActionAction, ScreenTypes } from '@epgu/epgu-constructor-types';
import {
  ConfigService,
  ConfigServiceStub,
  DownloadService,
  DownloadServiceStub,
  EventBusService,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
  SessionStorageService,
  SessionStorageServiceStub,
  LocationService,
  DeviceDetectorServiceStub,
  DeviceDetectorService,
} from '@epgu/epgu-constructor-ui-kit';
import { Clipboard } from '@angular/cdk/clipboard';
import { HookService } from '../../../core/services/hook/hook.service';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ActionService } from './action.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { configureTestSuite } from 'ng-bullet';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { ActionServiceStub } from './action.service.stub';
import {
  mockComponent,
  sendActionMock,
  deliriumAction,
  downloadAction,
  nextAction,
  nextStepModalAction,
  copyToClipboardAction,
  skipAction,
  prevAction,
  profileEditAction,
  downloadSpAdapterPdfAction,
} from './action.mock';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { cloneDeep } from 'lodash';
import { NotifierService } from '@epgu/ui/services/notifier';

describe('ActionToolsService', () => {
  let service: ActionToolsService;
  let downloadService: DownloadService;
  let navigationModalService: NavigationModalService;
  let screenService: ScreenService;
  let modalNextStepSpy: jasmine.Spy;
  let formPlayerApiService: FormPlayerApiService;
  let currentAnswersService: CurrentAnswersService;
  let formPlayerService: FormPlayerService;
  let locationService: LocationService;
  let notifierService: NotifierService;
  let htmlRemoverService: HtmlRemoverService;
  let modalService: ModalService;
  let clipboard: Clipboard;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        HtmlRemoverService,
        ActionToolsService,
        NavigationModalService,
        CurrentAnswersService,
        AutocompleteApiService,
        HttpClient,
        HttpHandler,
        EventBusService,
        EaisdoGroupCostService,
        JsonHelperService,
        NotifierService,
        Clipboard,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ActionToolsService);
    screenService = TestBed.inject(ScreenService);
    formPlayerService = TestBed.inject(FormPlayerService);
    downloadService = TestBed.inject(DownloadService);
    navigationModalService = TestBed.inject(NavigationModalService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    notifierService = TestBed.inject(NotifierService);
    htmlRemoverService = TestBed.inject(HtmlRemoverService);
    modalService = TestBed.inject(ModalService);
    clipboard = TestBed.inject(Clipboard);
    locationService = TestBed.inject(LocationService);

    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);

    modalNextStepSpy = spyOn(navigationModalService, 'next');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openConfirmationModal()', () => {
    it('should throw error if no confirmations found', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      const newAction = cloneDeep(profileEditAction);
      newAction.value = '123';
      expect(() => {
        service['openConfirmationModal'](deliriumAction, 'componentId');
      }).toThrow(Error);
    });
  });

  describe('deleteSuggestAction()', () => {
    it('should call formPlayerService.navigate()', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      const spy = jest.spyOn(formPlayerService, 'navigate');
      service['handleDeliriumAction'](deliriumAction, 'componentId');
      expect(spy).toBeCalled();
    });
  });

  describe('downloadAction()', () => {
    it('should call sendAction()', () => {
      const spy = jest.spyOn(service, 'sendAction');
      service['downloadAction'](downloadAction);
      expect(spy).toBeCalled();
    });
    it('should call downloadService.downloadFile()', () => {
      const spy = jest.spyOn(downloadService, 'downloadFile');
      service['downloadAction'](downloadAction);
      expect(spy).toBeCalled();
    });
  });

  describe('navigateModal()', () => {
    it('should call sendAction()', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      service['navigateModal'](nextStepModalAction, null, 'nextStep');
      expect(modalNextStepSpy).toBeCalled();
    });
  });

  describe('handleDeliriumAction()', () => {
    it('should call formPlayerService.navigate()', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      const formPlayerServiceNavigateSpy = spyOn(formPlayerService, 'navigate');
      service['handleDeliriumAction'](deliriumAction, 'componentId');
      expect(formPlayerServiceNavigateSpy).toBeCalled();
    });
  });

  describe('getActionDTO()', () => {
    it('should return ActionRequestPayload with currentUrl, if there is "addToCalendar" in action.action', () => {
      const result = { additionalParams: {}, scenarioDto: { cachedAnswers: [], currentUrl: '' }};
      const newAction = cloneDeep(profileEditAction);
      newAction.action = DTOActionAction.addToCalendar;
      expect(service['getActionDTO'](newAction)).toEqual(result);
    });
    it('should return ActionRequestPayload with additionalParams, if there is non-empty additionalParams in action.attrs', () => {
      const result = { additionalParams: { screenId: 's1' }, scenarioDto: { cachedAnswers: [] }};
      const newAction = cloneDeep(profileEditAction);
      newAction.attrs.additionalParams = { screenId: 's1' };
      expect(service['getActionDTO'](newAction)).toEqual(result);
    });
    it('should return NavigationOptions', () => {
      const result = { additionalParams: {}, scenarioDto: { cachedAnswers: [] }};
      expect(service['getActionDTO'](nextAction)).toEqual(result);
    });
  });

  describe('copyToClipboard()', () => {
    it('should call notifierService.success()', () => {
      const spy = jest.spyOn(notifierService, 'success');
      service.bufferData = copyToClipboardAction.value;
      service.copyToClipboard(copyToClipboardAction);
      expect(spy).toBeCalled();
    });
    it('should call service.sendAction(), if action.attrs.additionalParams exists', () => {
      service.bufferData = '';
      const spy = jest.spyOn(service, 'loadClipboardData');
      const newAction = cloneDeep(copyToClipboardAction);
      newAction.attrs.additionalParams = { screenId: 's1' };
      service.copyToClipboard(newAction);
      expect(spy).toBeCalled();
    });
    it('should call copyAndNotify() within service.sendAction(), with value + host + response.value string', () => {
      service.bufferData = '';
      const newAction = cloneDeep(copyToClipboardAction);
      newAction.attrs.additionalParams = { screenId: 's1' };
      service.copyToClipboard(newAction);
      expect(service.bufferData).toEqual('Скопирована ссылка: https://host.com/600101/1/formvalue');
    });
    it('should call copyAndNotify() within service.sendAction(), with value + host + response.value string without current url queryParams, if any', () => {
      const newAction = cloneDeep(copyToClipboardAction);
      locationService['setHref']('https://host.com/600101/1/form?key=value');
      newAction.attrs.additionalParams = { screenId: 's1' };
      service.copyToClipboard(newAction);
      expect(service.bufferData).toEqual('Скопирована ссылка: https://host.com/600101/1/formvalue');
    });
  });

  describe('copyAndNotify()', () => {
    it('should call clipboard.copy() with value', () => {
      service.bufferData = copyToClipboardAction.value;
      const spy = jest.spyOn(clipboard, 'copy');
      service.copyToClipboard(copyToClipboardAction);
      expect(spy).toHaveBeenCalledWith(copyToClipboardAction.value);
    });
    it('should call notifierService.success() with value', () => {
      service.bufferData = copyToClipboardAction.value;
      const spy = jest.spyOn(notifierService, 'success');
      service.copyToClipboard(copyToClipboardAction);
      expect(spy).toHaveBeenCalledWith({ message: copyToClipboardAction.value });
    });
  });

  describe('getOptions()', () => {
    it('should return NavigationOptions with url, if there is "service" in action.action attr', () => {
      const result = { url: profileEditAction.action };
      expect(service['getOptions'](profileEditAction)).toEqual(result);
    });
    it('should return NavigationOptions with isInternalScenarioFinish, if there is "goBackToMainScenario" in action.action attr', () => {
      const result = { isInternalScenarioFinish: true };
      const newAction = cloneDeep(profileEditAction);
      newAction.action = DTOActionAction.goBackToMainScenario;
      expect(service['getOptions'](newAction)).toEqual(result);
    });
    it('should return empty {} for rest cases', () => {
      const result = {};
      expect(service['getParams'](nextAction)).toEqual(result);
    });
  });

  describe('getParams()', () => {
    it('should return NavigationParams, if there is stepsBack attr in action', () => {
      const result = { stepsBack: 1 };
      expect(service['getParams'](prevAction)).toEqual(result);
    });
    it('should return empty {}, if there is no stepsBack attr in action', () => {
      const result = {};
      expect(service['getParams'](nextAction)).toEqual(result);
    });
  });

  describe('prepareNavigationData()', () => {
    it('should return Navigation', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const result = {
        options: { params: {}, url: 'service/actions/editPhoneNumber' },
        payload: { 123: { value: 'some value', visited: true }},
      };
      expect(service['prepareNavigationData'](nextAction, '123')).toEqual(result);
    });
  });

  describe('getComponentStateForNavigate()', () => {
    it('should return current value for custom screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      spyOn<any>(service, 'isTimerComponent').and.returnValue(false);
      const expectedValue = { 123: { value: 'some value', visited: true }};
      currentAnswersService.state = expectedValue;
      const value = service['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for timer case', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      spyOn<any>(service, 'isTimerComponent').and.returnValue(true);
      const expectedValue = { 123: { visited: true, value: nextAction.value }};
      const value = service['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: 'some value', visited: true }};
      currentAnswersService.state = 'some value';
      const value = service['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen with skipAction', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: '', visited: true }};
      currentAnswersService.state = 'some value';
      const value = service['getComponentStateForNavigate'](skipAction, '123');
      expect(value).toEqual(expectedValue);
    });
  });

  describe('prepareDefaultComponentState()', () => {
    it('should return ComponentStateForNavigate', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const result = { 123: { value: 'value', visited: true }};
      expect(service['prepareDefaultComponentState']('123', 'value', nextAction)).toEqual(result);
    });
  });

  describe('sendAction()', () => {
    it('should call htmlRemoverService.delete()', () => {
      const spy = jest.spyOn(htmlRemoverService, 'delete');
      service['sendAction'](nextAction);
      expect(spy).toBeCalled();
    });
    it('should call formPlayerApiService.sendAction()', () => {
      const spy = jest.spyOn(formPlayerApiService, 'sendAction');
      service['sendAction'](nextAction);
      expect(spy).toBeCalled();
    });
    it('should call formPlayerApiService.sendAction() with path and payload', () => {
      const spy = jest.spyOn(formPlayerApiService, 'sendAction');
      const path = 'sp-adapter/pdf?pdfName=Название_файла';
      const payload = {
        additionalParams: {},
        scenarioDto: {
          applicantAnswers: { 12: { visited: true }},
          cachedAnswers: [],
          currentValue: { 12: { visited: true }},
          display: undefined,
        },
      };
      service['sendAction'](downloadSpAdapterPdfAction);
      expect(spy).toHaveBeenCalledWith(path, payload, undefined);
    });
  });

  describe('isTimerComponent()', () => {
    it('should return false, if component found via passed componentId and its type is not TimerComponent', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      expect(service['isTimerComponent']('123')).toBeFalsy();
    });
    it('should return false, if component not found via passed componentId', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      expect(service['isTimerComponent']('nonExistingId')).toBeFalsy();
    });
    it('should return true, if component found via passed componentId and its type is TimerComponent', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.components[0].type = CustomScreenComponentTypes.Timer;
      screenService.display = display;
      expect(service['isTimerComponent']('123')).toBeTruthy();
    });
  });
});
