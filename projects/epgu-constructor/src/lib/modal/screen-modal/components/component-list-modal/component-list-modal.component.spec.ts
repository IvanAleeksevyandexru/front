import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ScreenTypes } from '@epgu/epgu-constructor-types';
import {
  CoreUiModule,
  DatesToolsService,
  ConfigService,
  ConfigServiceStub,
  HttpCancelService,
  LoggerService,
  LoggerServiceStub,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockModule } from 'ng-mocks';
import { ComponentListModalComponent } from './component-list-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ScreenModalServiceStub } from '../../screen-modal.service.stub';
import { CustomScreenService } from '../../../../screen/custom-screen/custom-screen.service';
import { ComponentsListModule } from '../../../../component/custom-screen/components-list.module';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { BaseModule } from '../../../../shared/base.module';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { TypeCastService } from '../../../../core/services/type-cast/type-cast.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';

describe('ComponentListModalComponent', () => {
  let component: ComponentListModalComponent;
  let fixture: ComponentFixture<ComponentListModalComponent>;
  let screenService: ScreenService;
  let navModalService: NavigationModalService;
  const screenDataMock = {
    components: [],
    terminal: false,
    header: '',
    id: '',
    name: '',
    type: ScreenTypes.CUSTOM,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentListModalComponent],
      imports: [
        BaseModule,
        MockModule(CoreUiModule),
        ComponentsListModule,
        RouterTestingModule,
        ScreenButtonsModule,
      ],
      providers: [
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        CurrentAnswersService,
        CustomScreenService,
        HttpCancelService,
        DatesToolsService,
        RefRelationService,
        DateRefService,
        JsonHelperService,
        TypeCastService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.componentErrors = {};
    navModalService = TestBed.inject(NavigationModalService);
    fixture = TestBed.createComponent(ComponentListModalComponent);
    component = fixture.componentInstance;
    screenService.display = screenDataMock as any;
    screenService.buttons = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be call navModalService.next', () => {
    const params = {};
    const spy = jest.spyOn(navModalService, 'next');
    component.nextStep(params);
    expect(spy).toHaveBeenCalledWith(params);
  });

  it('should be call navModalService.prevStep', () => {
    const params = {};
    const spy = jest.spyOn(navModalService, 'prev');
    component.prevStep(params);
    expect(spy).toHaveBeenCalledWith(params);
  });

  it('should be call nextStep', () => {
    const payload = {
      pd1: {
        value: 'true',
        visited: true,
      },
    };
    component.dataToSend = payload;
    const spy = jest.spyOn(component, 'nextStep');
    component.nextScreen();
    expect(spy).toHaveBeenCalledWith({
      payload,
    });
  });

  describe('changeComponentsList', () => {
    const payload = {
      pd1: {
        value: 'true',
        valid: true,
        isValid: true,
      },
    };

    it('should be change isValid', () => {
      component.changeComponentsList(payload);
      expect(component.isValid).toBeTruthy();
    });

    it('should be change dataToSend', () => {
      component.changeComponentsList(payload);
      expect(component.dataToSend).toEqual({
        pd1: {
          value: 'true',
          visited: true,
        },
      });
    });
  });
});
