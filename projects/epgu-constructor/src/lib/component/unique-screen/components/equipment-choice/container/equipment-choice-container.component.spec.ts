import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { of } from 'rxjs';

import { BaseComponentsModule, CoreUiModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CoreModule } from '../../../../../core/core.module';
import { BaseModule } from '../../../../../shared/base.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DefaultUniqueScreenWrapperComponent } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { EquipmentChoiceUpdateEvent, EquipmentChoiceSaveValue } from '../equipment-choice.types';
import { equipmentChoiceComponentMock, formValueMock } from '../equipment-choice.mocks';
import { EquipmentChoiceComponent } from '../components/equipment-choice/equipment-choice.component';
import { EquipmentChoiceContainerComponent } from './equipment-choice-container.component';

describe('EquipmentChoiceContainerComponent', () => {
  let component: EquipmentChoiceContainerComponent;
  let fixture: ComponentFixture<EquipmentChoiceContainerComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EquipmentChoiceContainerComponent,
        MockComponent(EquipmentChoiceComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
      ],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        BaseModule,
        BaseComponentsModule,
        ScreenPadModule,
      ],
      providers: [
        CurrentAnswersService,
        CachedAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentChoiceContainerComponent);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService = TestBed.inject(ScreenService);
    component = fixture.componentInstance;
    jest
      .spyOn(screenService, 'component$', 'get')
      .mockReturnValue(of(equipmentChoiceComponentMock));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change currentAnswersService state', () => {
    expect(currentAnswersService.state).toBeUndefined();
    expect(currentAnswersService.isValid).toBeFalsy();

    const data: EquipmentChoiceUpdateEvent = {
      value: formValueMock,
      isValid: true,
    };

    component.onEquipmentChoiceChange(data);
    expect(currentAnswersService.isValid).toEqual(data.isValid);
    expect(JSON.parse(currentAnswersService.state as string)).toEqual(
      new EquipmentChoiceSaveValue(data.value),
    );
  });
});
