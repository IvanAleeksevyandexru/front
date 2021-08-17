import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { ConfigService, ObjectHelperService } from '@epgu/epgu-constructor-ui-kit';

import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { AgeType, Gender, UserInfo } from '@epgu/epgu-constructor-types';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  const mockMaleValue: UserInfo = {
    name: 'Name',
    ageText: 'ageText',
    gender: Gender.male,
    ageType: AgeType.MATURE,
  };
  const mockFemaleValue: UserInfo = {
    name: 'Name',
    ageText: 'ageText',
    gender: Gender.female,
    ageType: AgeType.MATURE,
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserInfoComponent],
      providers: [ObjectHelperService, { provide: ConfigService, useClass: ConfigServiceStub }],
    })
      .overrideComponent(UserInfoComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    component.value = mockMaleValue;
    fixture.detectChanges();
  });

  it('should be text info', () => {
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-text'))
      ?.nativeElement;

    expect(div).not.toBeNull();
    expect(div.innerHTML?.indexOf('Name, ageText')).not.toBe(-1);
  });

  it('should be male icon', () => {
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-icon'))
      ?.nativeElement;
    expect(div).not.toBeNull();
    expect(div.getAttribute('src').indexOf('male-child.svg')).not.toBe(-1);
  });

  it('should be female icon', () => {
    component.value = mockFemaleValue;
    fixture.detectChanges();
    const div: HTMLDivElement = fixture.debugElement.query(By.css('.user-info-icon'))
      ?.nativeElement;
    expect(div).not.toBeNull();
    expect(div?.getAttribute('src')?.indexOf('female-child.svg')).not.toBe(-1);
  });
});
