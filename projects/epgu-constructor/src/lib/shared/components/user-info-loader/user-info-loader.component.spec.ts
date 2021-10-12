import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigService, ConfigServiceStub, DownloadService, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';
import { UserInfoLoaderComponent } from './user-info-loader.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CycledInfoComponent } from './components/cycled-info/cycled-info.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  AgeType,
  ComponentDto,
  CycledInfo,
  DisplayDto,
  Gender,
  InfoComponentDto,
  ScreenTypes,
  UserInfo,
  UserInfoComponentTypes
} from '@epgu/epgu-constructor-types';
import { componentMock } from '../../../component/unique-screen/components/select-children/components/select-children/mocks/select-children.mock';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

const displayMock = ({
  id: 's113',
  name: '',
  type: ScreenTypes.UNIQUE,
  header: '',
  components: [],
  accepted: true,
  impasse: false,
  terminal: false,
  firstScreen: false,
} as unknown) as DisplayDto;

const mockMaleValue: UserInfo = {
  name: 'Name',
  ageText: 'ageText',
  gender: Gender.male,
  ageType: AgeType.MATURE,
};

const mockCycledValue: CycledInfo[] = [{
  fieldName: 'ai19_1.value',
  value: 'fake value',
  isBold: false
}];

const mockInfoComponent = {
  id:'infoComponent',
  name:'',
  type: UserInfoComponentTypes.PersonInfo,
  label:'',
  attrs:{
    fields:[
      { fieldName:'birthDate' },
      { fieldName:'firstName' },
      { fieldName:'gender' }
    ],
    hidden:true,
    refs:{}
  },
  arguments:{},
  value:'{"name":"Илон","ageText":"2 месяца","ageType":"YOUNG","gender":"M"}',
  required:true
} as InfoComponentDto;

const mockCycledComponent = {
  id:'infoComponent',
  name:'',
  type: UserInfoComponentTypes.CycledInfo,
  label:'',
  attrs:{
    fields:[
      { fieldName:'birthDate' },
      { fieldName:'firstName' },
      { fieldName:'gender' }
    ],
    hidden:true,
    refs:{}
  },
  arguments:{},
  value: JSON.stringify(mockCycledValue),
  required:true
} as InfoComponentDto;

const userInfoSelector = 'epgu-constructor-user-info';
const cycledInfoSelector = 'epgu-constructor-cycled-info';


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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoLoaderComponent, UserInfoComponent, CycledInfoComponent],
      providers: [
        DownloadService,
        ObjectHelperService,
        JsonHelperService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
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
    const userInfo = fixture.debugElement.query(By.css(userInfoSelector));
    expect(userInfo).toBeNull();
  });

  describe('check render types', () => {
    it('PersonInfo', () => {
      screenService.infoComponents = [mockInfoComponent];
      fixture.detectChanges();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(userInfoSelector))).not.toBeNull();
      expect(fixture.debugElement.query(By.css(cycledInfoSelector))).toBeNull();
    });
    it('CycledInfo', () => {
      screenService.infoComponents = [mockCycledComponent];
      fixture.detectChanges();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(userInfoSelector))).toBeNull();
      expect(fixture.debugElement.query(By.css(cycledInfoSelector))).not.toBeNull();
    });
  });
});
