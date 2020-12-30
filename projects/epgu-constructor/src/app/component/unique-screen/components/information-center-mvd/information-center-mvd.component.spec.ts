import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InformationCenterMvdComponent } from './information-center-mvd.component';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary-api/dictionary-api.service.stub';
import { DisplayDto, DTOActionAction } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { of } from 'rxjs';
import { InformationCenterMvdI } from './interface/information-center-mvd.interface';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { ScreenTypes } from '../../../../screen/screen.types';

describe('InformationCenterMvdComponent', () => {
  let component: InformationCenterMvdComponent;
  let fixture: ComponentFixture<InformationCenterMvdComponent>;

  const mockData: InformationCenterMvdI = {
    id: '1',
    type: UniqueScreenComponentTypes.cityDepartment,
    label: '',
    value: '',
    valueFromCache: false,
    required: false,
    attrs: {
      sourceDictionary: {
        type: '',
        label: '',
        text: '',
        hint: '',
      },
      dictionaryToRequest: {
        type: '',
        label: '',
        text: '',
        hint: '',
      },
      actions: [{
        label: '',
        value: '0',
        action: DTOActionAction.getPrevStep,
      }],
    },
  };

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [InformationCenterMvdComponent],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        CachedAnswersService,
        UtilsService,
        NavigationService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterMvdComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    component.display$ = of(mockDisplay);
    component.isLoading$ = of(true);
    component.submitLabel$ = of('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
