import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MockComponent, MockModule } from 'ng-mocks';
import {
  EventBusService,
  ConstructorDropdownModule,
  CoreUiModule,
  ScreenPadModule,
} from '@epgu/epgu-constructor-ui-kit';
import { CachedAnswersDto } from '@epgu/epgu-constructor-types';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreModule } from '../../../../../core/core.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../shared/components/clone-button/clone-button.module';

import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { ComponentsListModule } from '../../../../custom-screen/components-list.module';
import { SelectChildrenScreenContainerComponent } from './select-children-screen-container.component';
import { SelectChildrenComponent } from '../components/select-children/select-children.component';

import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DefaultUniqueScreenWrapperComponent } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../shared/directives/action/action.service.stub';
import { UniquenessErrorsService } from '../../../../../shared/services/uniqueness-errors/uniqueness-errors.service';

describe('SelectChildrenScreenContainerComponent', () => {
  let component: SelectChildrenScreenContainerComponent;
  let fixture: ComponentFixture<SelectChildrenScreenContainerComponent>;
  let screenService: ScreenService;
  let uniquenessErrorsService: UniquenessErrorsService;
  let currentAnswersService: CurrentAnswersService;
  const selector = 'epgu-constructor-select-children';
  const componentMock = {
    id: 'scrchld16',
    name: '?????????????????????????? ???? ??????????????',
    type: 'COMPONENT',
    header: '?????????????????? ???????????????????????? ???????????? ??????????????',
    components: [
      {
        id: 'pd21',
        type: 'ConfirmChildData',
        label: '',
        attrs: {
          actions: [
            { label: '??????????????????????????', value: '', type: 'profileEdit', action: 'editPassportData' },
          ],
          fields: [
            { fieldName: 'firstName', label: '' },
            { fieldName: 'lastName', label: '' },
            { fieldName: 'middleName', label: '' },
            { fieldName: 'birthDate', label: '???????? ????????????????' },
            { fieldName: 'rfBirthCertificateSeries', label: '??????????' },
            { fieldName: 'rfBirthCertificateNumber', label: '??????????' },
            { fieldName: 'rfBirthCertificateActNumber', label: '?????????????? ??????????' },
            { fieldName: 'rfBirthCertificateIssueDate', label: '???????? ????????????' },
            { fieldName: 'rfBirthCertificateIssuedBy', label: '?????? ??????????' },
          ],
          refs: {},
        },
        linkedValues: [],
        arguments: {},
        value:
          // eslint-disable-next-line max-len
          '{"states":[{"groupName":"???????? ???????? ????????","fields":[{"label":"???????? ????????????????","value":"12.09.2020"}]},{"groupName":"?????????????????????????? ?? ????????????????","fields":[{"label":"?????????? ?? ??????????","value":"11111 1111"},{"label":"???????? ????????????","value":"01.10.2020"},{"label":"?????? ??????????","value":"111111"},{"label":"?????????????? ??????????","value":"-"}]}],"storedValues":{"firstName":"????????","lastName":"????????","rfBirthCertificateIssuedBy":"111111","rfBirthCertificateIssueDate":"01.10.2020","rfBirthCertificateSeries":"11111","middleName":"????????","rfBirthCertificateNumber":"1111","birthDate":"12.09.2020","rfBirthCertificateActNumber":"-"}}',
        required: true,
      },
    ],
    terminal: false,
    accepted: true,
    firstScreen: false,
    impasse: false,
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectChildrenScreenContainerComponent,
        MockComponent(SelectChildrenComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
      ],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        RouterTestingModule,
        ReactiveFormsModule,
        BaseModule,
        BaseComponentsModule,
        ScreenPadModule,
        CloneButtonModule,
        ConstructorDropdownModule,
        ComponentsListModule,
      ],
      providers: [
        EventBusService,
        CurrentAnswersService,
        CachedAnswersService,
        UniquenessErrorsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
      ],
    })
      .overrideComponent(SelectChildrenScreenContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenScreenContainerComponent);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService = TestBed.inject(ScreenService);
    uniquenessErrorsService = TestBed.inject(UniquenessErrorsService);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(componentMock) as any);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be updateCurrentAnswersState() and calculatePreparedUniqErrors() called', () => {
    const data = [];
    const spy = jest.spyOn(uniquenessErrorsService, 'calculatePreparedUniqErrors');
    component.updateCurrentAnswersState(data, 0);
    expect(currentAnswersService.state).toBe(data);
    expect(spy).toHaveBeenCalled();
  });

  it('should be updateCurrentAnswersValid()', () => {
    jest.spyOn(component, 'updateCurrentAnswersValid');
    const debugEl = fixture.debugElement.query(By.css(selector));
    debugEl.triggerEventHandler('updateCurrentAnswerServiceValidationEvent', true);

    expect(component.updateCurrentAnswersValid).toHaveBeenCalled();
    expect(currentAnswersService.isValid).toBeTruthy();
  });

  describe('cachedValue$', () => {
    it('should be return null', () => {
      component.cachedValue$.subscribe((value) => {
        expect(value).toBeNull();
      });
    });

    it('should be return cachedValue', () => {
      const value = JSON.stringify([
        {
          ai18_4: '??????????????????',
          ai18_6: 'false',
          ai18_0: '7588684',
          ai18_1: '2021-01-16T00:00:00Z',
          ai18_2: 'M',
          ai18_3: '??????????',
        },
      ]);
      const cachedAnswersMock: CachedAnswersDto = {
        ai18: {
          value,
          visited: true,
        },
      };
      jest.spyOn(screenService, 'cachedAnswers', 'get').mockReturnValue(cachedAnswersMock);
      jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(componentMock) as any);
      component.cachedValue$.subscribe((cachedValue) => {
        expect(cachedValue).toBeNull();
      });
    });
  });
});
