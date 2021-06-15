import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { UserInfoLoaderComponent } from './user-info-loader.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CycledInfoComponent } from './components/cycled-info/cycled-info.component';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { DisplayDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { AgeType, Gender, UserInfoType } from './components/user-info/user-info.type';
import { UserInfoComponentTypes } from './user-info-loader.types';

import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { componentMock } from '../../../component/unique-screen/components/select-children/components/select-children/mocks/select-children.mock';
import { CycledInfo } from './components/cycled-info/cycled-info.types';

const displayMock = ({
  id: 's113',
  name: '',
  type: ScreenTypes.UNIQUE,
  header: '',
  submitLabel: '',
  components: [],
  accepted: true,
  impasse: false,
  terminal: false,
  firstScreen: false,
} as unknown) as DisplayDto;

const mockMaleValue: UserInfoType = {
  name: 'Name',
  ageText: 'ageText',
  gender: Gender.M,
  ageType: AgeType.MATURE,
};

const mockCycledValue: CycledInfo[] = [{
  fieldName: 'ai19_1.value',
  value: 'fake value',
  isBold: false
}];

describe('UserInfoLoaderComponent', () => {
  let component: UserInfoLoaderComponent;
  let fixture: ComponentFixture<UserInfoLoaderComponent>;
  let screenService: ScreenService;

  const mockComponent = ({
    id: 'c1',
    attrs: [],
    value: mockMaleValue,
    type: UserInfoComponentTypes.PersonInfo,
  } as unknown) as ComponentDto;
  const t = ({
    infoComponents: ['c1'],
    components: [({ id: 'c1', value: mockMaleValue } as unknown) as ComponentDto],
  } as unknown) as DisplayDto;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoLoaderComponent, UserInfoComponent, CycledInfoComponent],
      providers: [
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    })
      .overrideComponent(UserInfoLoaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoLoaderComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'display$', 'get').mockReturnValue(of(displayMock));
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(componentMock));
  });

  it('should be for display is empty', () => {
    fixture.detectChanges();
    const userInfo = fixture.debugElement.query(By.css('epgu-constructor-user-info'));
    expect(userInfo).toBeNull();
  });

  it('should be for component is empty', () => {
    component.isDisplay = false;
    fixture.detectChanges();
    const userInfo = fixture.debugElement.query(By.css('epgu-constructor-user-info'));
    expect(userInfo).toBeNull();
  });

  it('should be for display is not empty', () => {
    jest
      .spyOn(screenService, 'displayInfoComponents$', 'get')
      .mockReturnValueOnce(of([[mockComponent, mockMaleValue]]));
    fixture.detectChanges();
    const userInfo = fixture.debugElement.query(By.css('epgu-constructor-user-info'));

    expect(userInfo).not.toBeNull();
  });
  it('should be for component is not empty', () => {
    jest
      .spyOn(screenService, 'componentInfoComponents$', 'get')
      .mockReturnValueOnce(of([[mockComponent, mockMaleValue]]));
    component.isDisplay = false;
    fixture.detectChanges();
    const userInfo = fixture.debugElement.query(By.css('epgu-constructor-user-info'));

    expect(userInfo).not.toBeNull();
  });

  describe('check render types', () => {
    const userInfoSelector = 'epgu-constructor-user-info';
    const cycledInfoSelector = 'epgu-constructor-cycled-info';

    const setDisplayInfo = (cmp, value) => jest
      .spyOn(screenService, 'displayInfoComponents$', 'get')
      .mockReturnValueOnce(of([[cmp, value]]));

    it('PersonInfo', () => {
      setDisplayInfo(mockComponent, mockMaleValue );
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(userInfoSelector))).not.toBeNull();
      expect(fixture.debugElement.query(By.css(cycledInfoSelector))).toBeNull();
    });
    it('CycledInfo', () => {
      setDisplayInfo({ ...mockComponent, type: UserInfoComponentTypes.CycledInfo }, mockCycledValue );
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(userInfoSelector))).toBeNull();
      expect(fixture.debugElement.query(By.css(cycledInfoSelector))).not.toBeNull();
    });
  });
});
