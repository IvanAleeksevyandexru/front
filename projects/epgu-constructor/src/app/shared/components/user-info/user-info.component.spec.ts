import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { AgeType, Gender, UserInfoType } from './user-info.type';
import { ConfigService } from '../../../core/services/config/config.service';
import { UtilsService } from '../../../core/services/utils/utils.service';

import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  const mockValue: UserInfoType = {
    name: 'Name',
    ageText: 'ageText',
    gender: Gender.M,
    ageType: AgeType.MATURE,
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      providers: [UtilsService, { provide: ConfigService, useClass: ConfigServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    component.value = mockValue;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
