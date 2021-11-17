import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockModule, MockPipe } from 'ng-mocks';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { OutputHtmlModule } from '../../../../../../shared/components/output-html/output-html.module';
import { ConfirmPersonalUserLegalDataComponent } from './confirm-personal-user-legal-data.component';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../screen/current-answers-service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionType } from '@epgu/epgu-constructor-types';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { ConfirmPersonalUserDataPipe } from '../../confirm-personal-user-data.pipe';

const componentMock = {
  id: 'fakeId',
  type: 'ConfirmLegalData',
  attrs: { fields: [] },
  value: '',
  visited: false,
};

const actionMock = {
  label: '',
  value: '',
  action: '',
  type: ActionType.profileEdit,
};

describe('ConfirmPersonalUserLegalDataComponent', () => {
  let component: ConfirmPersonalUserLegalDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserLegalDataComponent>;
  let screenService: ScreenServiceStub;
  let currentAnswersService: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmPersonalUserLegalDataComponent,
        MockPipe(ConfirmPersonalUserDataPipe, (value) => value),
      ],
      imports: [
        MockModule(OutputHtmlModule),
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(FieldListModule),
        MockModule(ScreenPadModule),
      ],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
      .overrideComponent(ConfirmPersonalUserLegalDataComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserLegalDataComponent);
    component = fixture.componentInstance;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = componentMock;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock as any);
  });

  it('should render epgu-constructor-default-unique-screen-wrapper', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper';
    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.header).toBeUndefined();
    expect(debugEl.componentInstance.isLoading).toBeFalsy();
    expect(debugEl.componentInstance.screenActionButtons).toBeUndefined();
    expect(debugEl.componentInstance.actionButtons).toBeUndefined();
    expect(debugEl.componentInstance.isShowActionBtn).toBeFalsy();
    expect(debugEl.componentInstance.showNav).toBeFalsy();
    expect(debugEl.componentInstance.isValid).toBeFalsy();

    screenService.header = 'some header';
    screenService.isLoadingSubject.next(true);
    screenService.showNav = true;
    screenService.buttons = [{ label: 'some submit label', action: 'fake action' }] as any;
    currentAnswersService.isValid = true;
    fixture.detectChanges();

    expect(debugEl.componentInstance.header).toBe('some header');
    expect(debugEl.componentInstance.isLoading).toBeTruthy();
    expect(debugEl.componentInstance.screenButtons).toEqual([
      { label: 'some submit label', action: 'fake action' },
    ]);
    expect(debugEl.componentInstance.showNav).toBeTruthy();
    expect(debugEl.componentInstance.isValid).toBeTruthy();
  });

  it('should render epgu-cf-ui-constructor-screen-pad', () => {
    const selector = 'epgu-cf-ui-constructor-screen-pad';
    screenService.component = componentMock as any;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
  });

  it('should render epgu-constructor-field-list', () => {
    const selector = 'epgu-constructor-field-list';
    expect(fixture.debugElement.query(By.css(selector))).toBeNull();

    screenService.component = componentMock as any;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
    expect(fixture.debugElement.query(By.css(selector)).componentInstance.data).toBe(componentMock);
  });

  it('should render epgu-constructor-output-html', () => {
    const selector = 'epgu-constructor-output-html';
    expect(fixture.debugElement.query(By.css(selector))).not.toBeTruthy();

    screenService.component = { ...componentMock, attrs: { hint: 'fake hint' }};
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
  });
});
